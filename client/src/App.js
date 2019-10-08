import React, {Component} from 'react';
import {Router} from "@reach/router";
import Kitten from "./Kitten";
import Kittens from "./Kittens";

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
        // Get everything from the API
        this.getKittens().then(() => console.log("Kittens gotten!"));
    }

    async getKittens() {
        let url = `${this.API_URL}/kittens`; // URL of the API.
        let result = await fetch(url); // Get the data
        let json = await result.json(); // Turn it into json
        return this.setState({ // Set it in the state
            kittens: json
        })
    }

    getKitten(id) {
        // Find the relevant kitten by id
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
