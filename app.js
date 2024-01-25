const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'client/images/',
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    },  
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('client'));
app.use(express.json());

const clothesFile = JSON.parse(fs.readFileSync('data/clothesData.json', 'utf-8'));
const ownerFile = JSON.parse(fs.readFileSync('data/ownersData.json', 'utf-8'));
const reservationsFile = JSON.parse(fs.readFileSync('data/reservationsData.json', 'utf-8'));

app.get('/clothesData', function (request, response) {
    try{
        response.json(clothesFile)
    }
    catch (error) {
        response.status(400).send('Client Error, try a different request');
    }
});

app.get('/ownerData', function (request, response) {
    try{
        response.json(ownerFile)
        }
    catch (error) {
        console.error('Error handling owner data:', error.message);
        response.status(400).send('Client Error, try a different request');
    }
});

app.get('/reservationsFile/:id', function (request, response) {
    try{
        const clothesName = request.params.id;
        const unavailableDates = reservationsFile.filter(reservation => reservation.name === clothesName);
        response.json(unavailableDates);
    }        
    catch (error) {
        console.error('Error handling reservations data:', error.message);
        response.status(400).send('Client Error, try a different request');
    }
});

app.post('/addReservation', function (request, response) {
    try {
        const newReservation = request.body;
        reservationsFile.push(newReservation);
        fs.writeFileSync('data/reservationsData.json', JSON.stringify(reservationsFile, null, 2));
        response.status(200).send('Reservation data received');
    } catch (error) {
        response.status(400).send('Client Error, try a different request');
    }
});

app.post('/addClothesData', function (request, response) {
    try{
        const newClothes = request.body;
        clothesFile.push(newClothes);
        fs.writeFileSync('data/clothesData.json', JSON.stringify(clothesFile, null, 2));
        response.status(200).send('Clothes data received, refresh to see it in the list');
    } 
    catch (error) {
        response.status(400).send('Client Error, try a different request');
    }
});

app.post('/uploadImage', upload.single('image'), (request, response) => {
    try{
        const imagePath = `${request.file.filename}`;
        const lastItem = clothesFile[clothesFile.length - 1];
        if (lastItem) {
            lastItem.image = imagePath;
        }
        fs.writeFileSync('data/clothesData.json', JSON.stringify(clothesFile, null, 2));
        response.status(200).send('Image uploaded successfully');
    }
    catch (error) {
        response.status(400).send('Client Error, try a different request');
    }
});

module.exports = app;