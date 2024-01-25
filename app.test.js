'use strict';

const request = require('supertest');
const app = require('./app');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'client/',
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    },  
});
const upload = multer({ storage: storage });


describe('Test my requests', () => {
    test('GET /clothesData returns JSON', () => {
        return request(app)
        .get('/clothesData')
        .expect('Content-type', /json/)
        .expect(200)
    });

    test('GET /ownerData returns JSON', () => {
        return request(app)
        .get('/ownerData')
        .expect('Content-type', /json/)
        .expect(200)
    });

    test('GET /reservationsFile/:id returns JSON', () => {
        const id = "navy mesh top"
        return request(app)
        .get(`/reservationsFile/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
    });

    test('POST /addReservation succeeds', () => {
        return request(app)
        .post('/addReservation')
    .expect(200);
    });

    test('POST /addClothesData succeeds', () => {
        return request(app)
        .post('/addClothesData')
        .expect(200);
    });

    test('POST /addReservation succeeds', () => {
        return request(app)
        .post('/addReservation')
        .expect(200);
    });
});

describe('POST /uploadImage', () => {
    it('uploads an image and updates the last item in clothesFile', async () => {
        const formData = new FormData(); 
        
        const filePath = path.join(__dirname, '../prog-assessment/client/images/blue_top.JPG'); // Adjust the path as needed

        formData.append('image', fs.createReadStream(filePath));

        const response = await request(app)
        .post('/uploadImage', formData)
        .attach('image', filePath)
        .expect('Content-Type', /json/)
        .expect(200);
        expect(response.body).toHaveProperty('imagePath');
        const clothesFile = JSON.parse(fs.readFileSync('data/clothesData.json'));
        const lastItem = clothesFile[clothesFile.length - 1];
        expect(lastItem).toHaveProperty('image', response.body.imagePath);
    }, 10000);
});