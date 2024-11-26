const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: "Data retrieved successfully" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
