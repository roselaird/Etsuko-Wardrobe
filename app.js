const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
app.use(cors());

app.use(express.static('client'));
app.use(express.json());

const clothesFile = JSON.parse(fs.readFileSync('data/clothesData.json', 'utf-8'));

app.get('/clothesData', function (request, response) {
    response.json(clothesFile);
    console.log('server get');
});

module.exports = app;