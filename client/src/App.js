import React, {Component} from 'react';
import {Router} from "@reach/router";
import Kitten from "./Kitten";
import Kittens from "./Kittens";
import { stringArraysEqual } from './Util';

class App extends Component {
    // API url from the file '.env' OR the file '.env.development'.
    // The first file is only used in production.
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.state = {
            kittens: []
        };
    }

    componentDidMount() {
        // Get kitten data from the API
        this.getKittens().then(() => console.log("Kittens fetched!"));
    }

    /**
     * Fetch kittens, but only their names and ids. Additional data is left out.
     * @returns {Promise<void>}
     */
    async getKittens() {
        let url = `${this.API_URL}/kittens`; // URL of the API.
        let result = await fetch(url); // Get the data
        let json = await result.json(); // Turn it into json
        return this.setState({ // Set it in the state
            kittens: json
        })
    }

    /**
     * Loading all data for one specific kitten. Will trigger setState() if new data was found.
     * @param id the id of the kitten
     * @returns {Promise}
     */
    async loadKittenData(id) {
        const updateKitten = (kitten) => {
            const index = this.state.kittens.findIndex(k => k._id === id);
            if (index === -1) return; // Return if kitten is not yet in app.js state
            const localKitten = this.state.kittens[index];

            // See if the kitten has new data
            let equal = stringArraysEqual(kitten.hobbies, localKitten.hobbies);

            // Only update state if data is new (not equal)!
            // Otherwise, this will result in an infinite React re-render loop!
            if (!equal) {
                console.log("Updating local kitten state with new data", kitten._id);
                const newKittensState = this.state.kittens;
                newKittensState[index] = kitten; // Replace old data with new
                this.setState({ // Update state
                    kittens: newKittensState
                })
            }
        };

        try {
            let url = `${this.API_URL}/kittens/${id}`; // URL of the API.
            let result = await fetch(url); // Get the data
            let kitten = await result.json(); // Turn it into json
            updateKitten(kitten); // Kitten loaded, let's update state.
        } catch (e) {
            console.error(e);
        }
    }

    getKitten(id) {
        // Load additional data if needed - this call is async, and will trigger a state
        // update if new data is found. "state update" means re-render.
        this.loadKittenData(id).then(console.log("Kitten fetched", id));

        // Find the relevant kitten by id - not waiting for new data.
        return this.state.kittens.find(k => k._id === id);
    }

    render() {
        return (
            <div className="container">
                <Router>
                    <Kitten path="/kitten/:id" getKitten={id => this.getKitten(id)} />
                    <Kittens path="/" kittens={this.state.kittens}/>
                </Router>
            </div>
        );
    }
}

export default App;
