import React, {Component} from 'react';
import {Link} from "@reach/router";

class Kitten extends Component {

    render() {
        const kitten = this.props.getKitten(this.props.id);
        let content = <p>Loading</p>;
        if (kitten) {
            let hobbies = <p>"No hobbies loaded"</p>;
            if (kitten.hobbies) {
                hobbies = <ul>
                    {kitten.hobbies.map(h => <li key={h}>{h}</li>)}
                </ul>
            }
            content =
                <React.Fragment>
                    <h1>{kitten.name}</h1>

                    <h3>Hobbies</h3>
                    {hobbies}

                    <Link to="/">Back</Link>
                </React.Fragment>
        }

        return content;
    }
}

export default Kitten;
