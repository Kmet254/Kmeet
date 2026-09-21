const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// This automatically serves your index.html and other frontend files from the public folder
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
