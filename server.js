const express = require('express');
const app = express();
const path = require('path');
const port = 3000; // You can choose any available port

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});