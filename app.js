const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const storage = multer.diskStorage({
    
    destination: 'client/',
    filename: function (req, file, cb) {
        console.log('storage');
        cb(null, file.originalname);
        
    },
   
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static('client'));
app.use(express.json());

const clothesFile = JSON.parse(fs.readFileSync('data/clothesData.json', 'utf-8'));
const ownerFile = JSON.parse(fs.readFileSync('data/ownersData.json', 'utf-8'));

app.get('/clothesData', function (request, response) {
    console.log('she returs', clothesFile)
    response.json(clothesFile);
    // 
});

app.get('/ownerData', function (request, response) {
    response.json(ownerFile);
});

app.post('/addClothesData', function (request, response) {
    console.log('add clothes function')
    const newClothes = request.body;
    clothesFile.push(newClothes);
    fs.writeFileSync('data/clothesData.json', JSON.stringify(clothesFile, null, 2));
    response.send('Clothes data received, refresh to see it in the list');
});

app.post('/uploadImage', upload.single('image'), (req, res) => {
    // File has been uploaded, you can return the URL or any identifier for the file
    console.log("we're postin the pic!")
    
    const imagePath = `${req.file.filename}`;
    // Add the imagePath property to the last item in the array
    console.log('imagePath', imagePath)
    
    const lastItem = clothesFile[clothesFile.length - 1];
    if (lastItem) {
        lastItem.image = imagePath;
    }

    // Write the modified object back to the JSON file
    fs.writeFileSync('data/clothesData.json', JSON.stringify(clothesFile, null, 2));

    // Send a response with the imagePath
    res.json({ imagePath });
});

module.exports = app;