
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public')); // or adjust if your static files are here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Kmeet App!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Kmeet App!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to Kmeet App!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

