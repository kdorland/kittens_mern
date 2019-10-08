import React, {Component} from 'react';
import {Link} from "@reach/router";

class Kittens extends Component {

    render() {
        return (
            <React.Fragment>
                <h1>Kittens</h1>
                <ol>
                    {this.props.kittens.map(kitten =>
                        <li key={kitten._id}>
                            <Link to={`/kitten/${kitten._id}`}>{kitten.name}</Link>
                        </li>)}
                </ol>
            </React.Fragment>
        );
    }

}

export default Kittens;
