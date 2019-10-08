const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Only needed when running build in production mode

/**** Routes ****/
app.get('/api/kittens', (req, res) => {
    // Get all kittens. Put kitten into json response when it resolves.
    db.getKittens().then(kittens => res.json(kittens));
});

app.get('/api/kittens/:id', (req, res) => {
    let id = req.params.id;
    db.getKitten(id).then(kitten => res.json(kitten));
});

app.post('/api/kittens', (req, res) => {
    let kitten = {
        name : req.body.name,
        hobbies : [] // Empty hobby array
    };
    db.createKitten(kitten).then(newKitten => res.json(newKitten));
});

app.post('/api/kittens/:id/hobbies', (req, res) => {
    // To add a hobby, you need the id of the kitten, and some hobby text from the request body.
    db.addHobby(req.params.id, req.body.hobby)
        .then(updatedKitten => res.json(updatedKitten));
});


/**** Start ****/

let db = {}; // Empty DB object

// Require and connect the DB
require('./db').connectDb()
    .then(async dbObject => {
        db = dbObject; // Save a copy of the db object for the routes above.
        await db.bootstrap(); // Fill in test data if needed.

        // When DB connection is ready, let's open the API for access
        app.listen(port, () => {
            console.log(`Kitten API running on port ${port}!`)
        });
    })
    .catch(error => console.error(error));



