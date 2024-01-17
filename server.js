const express = require('express');
const app = express();
const path = require('path');
const port = 3000; // You can choose any available port
const fs = require('fs');

const clothesFile = 'clothes/clothes.json';

app.use(express.static('client'));
app.use(express.json());

const clothesList = JSON.parse(fs.readFileSync(clothesFile));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/clothes', (req, res) => {
  //res.sendFile('top_1.jpg', { root: __dirname });
  res.send(clothesList[0].name)
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});