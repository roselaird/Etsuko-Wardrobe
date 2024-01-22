const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
app.use(cors());

app.use(express.static('client'));
app.use(express.json());

const clothesFile = JSON.parse(fs.readFileSync('data/clothesData.json', 'utf-8'));
const ownerFile = JSON.parse(fs.readFileSync('data/ownersData.json', 'utf-8'));

app.get('/clothesData', function (request, response) {
    console.log('she returs', clothesFile)
    response.json(clothesFile);
});

app.get('/ownerData', function (request, response) {
    response.json(ownerFile);
});

module.exports = app;