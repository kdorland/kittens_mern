import React, {Component} from 'react';
import {Link} from "@reach/router";

class Kitten extends Component {
    render() {
        const kitten = this.props.getKitten(this.props.id);
        let content = <p>Loading</p>;
        if (kitten) {
            content =
                <>
                    <h1>{kitten.name}</h1>

                    <h3>Hobbies</h3>
                    <ul>
                        {kitten.hobbies.map(h => <li key={h}>{h}</li>)}
                    </ul>

                    <Link to="/">Back</Link>
                </>
        }
        return content;
    }
}

export default Kitten;
