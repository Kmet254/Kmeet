const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve all static files (CSS, images, etc.) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve myweb.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myweb.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
