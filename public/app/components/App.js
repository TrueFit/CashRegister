import React from 'react';
import TransactionsForm from './TransactionsForm';

export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <main>
                <h1>Home1234</h1>
                <TransactionsForm />
            </main>
        )
    }
}