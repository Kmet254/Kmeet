const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for local cross-origin requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files from the project root directory
app.use(express.static(__dirname));

// Serve chat.html on http://localhost:5000
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'chat.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File Send Error:', err.message);
      res.status(404).send('<h1>chat.html not found!</h1><p>Please make sure chat.html is in the same folder as server.js.</p>');
    }
  });
});

// Middleware to generate Safaricom Daraja OAuth Token
const getOAuthToken = async (req, res, next) => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return res.status(500).json({ error: 'M-Pesa API credentials are missing in your .env file' });
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    req.token = response.data.access_token;
    next();
  } catch (error) {
    console.error('OAuth Token Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to authenticate with Safaricom. Check your .env credentials.' });
  }
};

// Route to initiate STK Push
app.post('/api/stkpush', getOAuthToken, async (req, res) => {
  const { phone, amount } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone number and amount are required' });
  }

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: 'WebChatPayment',
    TransactionDesc: 'Payment for Chat Service',
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${req.token}` } }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('STK Push Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: error.response && error.response.data ? error.response.data.errorMessage : 'Failed to initiate STK Push' 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));