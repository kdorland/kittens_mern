const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Only needed when running build in production mode

/**** Database ****/
// The "Kitten Data Access Layer".
const kittenDAL = require('./kitten_dal')(mongoose);

/**** Routes ****/
app.get('/api/kittens', (req, res) => {
    // Get all kittens. Put kitten into json response when it resolves.
    kittenDAL.getKittens().then(kittens => res.json(kittens));
});

app.get('/api/kittens/:id', (req, res) => {
    let id = req.params.id;
    kittenDAL.getKitten(id).then(kitten => res.json(kitten));
});

app.post('/api/kittens', (req, res) => {
    let kitten = {
        name : req.body.name,
        hobbies : [] // Empty hobby array
    };
    kittenDAL.createKitten(kitten).then(newKitten => res.json(newKitten));
});

app.post('/api/kittens/:id/hobbies', (req, res) => {
    // To add a hobby, you need the id of the kitten, and some hobby text from the request body.
    kittenDAL.addHobby(req.params.id, req.body.hobby)
        .then(updatedKitten => res.json(updatedKitten));
});

/**** Start ****/
const url = (process.env.MONGO_URL || 'mongodb://localhost/kitten_db');
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await kittenDAL.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`Kitten API running on port ${port}!`)
    })
    .catch(error => console.error(error));



