import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Kitten from './Kitten';

// Some test data for the tests.
const kitten = {
    id: 42,
    name: "Tom",
    hobbies: ["sleeping", "purring", "people watching", "eating"]
};

it('renders the name of the kitten', () => {
    const comp = <Kitten getKitten={_ => kitten}/>;
    const {getByText} = render(comp);
    expect(getByText(kitten.name)).toBeInTheDocument();
});

it('renders the "Hobbies" header', () => {
    const comp = <Kitten getKitten={_ => kitten}/>;
    const {getByText} = render(comp);
    expect(getByText("Hobbies")).toBeInTheDocument();
});

it('renders each hobby', () => {
    const comp = <Kitten getKitten={_ => kitten}/>;
    const {getByText} = render(comp);
    kitten.hobbies.forEach(h => expect(getByText(h)).toBeInTheDocument());
});

it('renders the "Back" link', () => {
    const comp = <Kitten getKitten={_ => kitten}/>;
    const {getByText} = render(comp);
    expect(getByText(/back/i)).toBeInTheDocument();
});