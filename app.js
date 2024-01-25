const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'client/',
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
    response.json(clothesFile);
});

app.get('/ownerData', function (request, response) {
    response.json(ownerFile);
});

app.get('/reservationsFile/:id', function (request, response) {
    const clothesName = request.params.id;
    const unavailableDates = reservationsFile.filter(reservation => reservation.clothesName === clothesName);
    //const reservations = owner.reservations;
    response.json(unavailableDates);
});

app.post('/addReservation', function (request, response) {
    try {
        console.log('add reservation function')
        const newReservation = request.body;
        reservationsFile.push(newReservation);
        fs.writeFileSync('data/reservationsData.json', JSON.stringify(reservationsFile, null, 2));
        response.send('Reservation data received, refresh to see it in the list');
    } catch (error) {
        console.error('Error handling addReservation:', error.message);
        response.status(500).send('Internal Server Error');
    }
});

app.post('/addClothesData', function (request, response) {
    try{
        const newClothes = request.body;
        clothesFile.push(newClothes);
        fs.writeFileSync('data/clothesData.json', JSON.stringify(clothesFile, null, 2));
        response.send('Clothes data received, refresh to see it in the list');
    } 
    
    catch (error) {
        console.error('Error handling addClothesData:', error.message);
        response.status(500).send('Internal Server Error');
    }
    });

app.post('/uploadImage', upload.single('image'), (req, res) => {
    console.log("we're postin the pic!")
    const imagePath = `${req.file.filename}`;
    console.log('imagePath', imagePath)
    
    const lastItem = clothesFile[clothesFile.length - 1];
    console.log('lastItem', lastItem)
    if (lastItem) {
        lastItem.image = imagePath;
        console.log('lastItem', lastItem,imagePath )
    }
    fs.writeFileSync('data/clothesData.json', JSON.stringify(clothesFile, null, 2));
    
    res.json({ imagePath });
});

module.exports = app;