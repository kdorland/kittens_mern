const mongoose = require('mongoose'); // We need the mongoose library

class Db {
    constructor() {
        // This is the schema we need to store kittens in MongoDB
        const kittenSchema = new mongoose.Schema({
            name: String,
            hobbies: [String] // A list of hobbies as string
        });
        this.kittenModel = mongoose.model('kitten', kittenSchema);
    }

    async getKittens() {
        try {
            return await this.kittenModel.find({});
        } catch (error) {
            console.error("getKittens:", error.message);
            return {};
        }
    }

    async getKitten(id) {
        try {
            return await this.kittenModel.findById(id);
        } catch (error) {
            console.error("getKitten:", error.message);
            return {};
        }
    }

    async createKitten(newKitten) {
        let kitten = new this.kittenModel(newKitten);
        return kitten.save();
    }

    async addHobby(kittenId, hobby) {
        const kitten = await this.getKitten(kittenId);
        kitten.hobbies.push(hobby);
        return kitten.save();
    }

    /**
     * This method adds a bunch of test data if the database is empty.
     * @param count The amount of kittens to add.
     * @returns {Promise} Resolves everything has been saved.
     */
    async bootstrap(count = 10) {
        const hobbies = ['sleeping', 'purring', 'eating', 'people watching'];
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function getRandomName() {
            return ['Garfield', 'Tom', 'Felix', 'Snowball'][getRandomInt(0,3)]
        }

        function getRandomHobbies() {
            const shuffled = hobbies.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, getRandomInt(1,shuffled.length));
        }

        let l = (await this.getKittens()).length;
        console.log("Kitten collection size:", l);

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let kitten = new this.kittenModel({
                    name: getRandomName(),
                    hobbies: getRandomHobbies()
                });
                promises.push(kitten.save());
            }

            return Promise.all(promises);
        }
    }
}

// We are exporting an async function named 'ConnectDb'.
// It only resolves when the database connection is ready.
// It resolves with an Db object instantiated from the class above.
// The Db object is used for all data access in this app.
module.exports.connectDb = async () => {
    const url = (process.env.MONGO_URL || 'mongodb://localhost/kitten_db');
    return mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Kitten database connected");
            return new Db();
        })
        .catch(error => { console.error(error) });
};