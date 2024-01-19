const express = require('express');
const app = express();
const fs = require('fs');


app.use(express.static('client'));
app.use(express.json());

//const clothesFilePath = 'data/clothes.json';

const clothesFile = JSON.parse(fs.readFileSync('data/clothes.json', 'utf-8'));

app.get('/clothes', function (request, response) {
        response.send(clothesFile);
});

module.exports = app;