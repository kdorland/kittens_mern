const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

/**** Configuration ****/
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Needed for serving production build of React

/**** Database ****/
const kittenDB = require('./kitten_db')(mongoose);

/**** Routes ****/
app.get('/api/kittens', async (req, res) => {
    const kittens = await kittenDB.getKittens();
    res.json(kittens);
});

app.get('/api/kittens/:id', async (req, res) => {
    let id = req.params.id;
    const kitten = await kittenDB.getKitten(id);
    res.json(kitten);
});

app.post('/api/kittens', async (req, res) => {
    let kitten = {
        name : req.body.name,
        hobbies : [] // Empty hobby array
    };
    const newKitten = await kittenDB.createKitten(kitten);
    res.json(newKitten);
});

app.post('/api/kittens/:id/hobbies', async (req, res) => {
    const id = req.params.id;
    const hobby = req.body.hobby;
    const updatedKitten = await kittenDB.addHobby(id, hobby);
    res.json(updatedKitten);
});

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html) to be handled by Reach router
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

/**** Start ****/
const url = process.env.MONGO_URL || 'mongodb://localhost/kitten_db';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        await kittenDB.bootstrap(); // Fill in test data if needed.
        await app.listen(port); // Start the API
        console.log(`Kitten API running on port ${port}!`);
    })
    .catch(error => console.error(error));
