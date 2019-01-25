import React from 'react';
import axios from 'axios';

export default class TransactionsForm extends React.Component {
    constructor() {
        super();

        this.state = {
            transactionsList: {}
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFileUpload(event) {
        this.setState({
            transactionsList: event.target.files[0]
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData()
        data.append('file', this.state.transactionsList, this.state.transactionsList.name)

        axios.post('/transactionsList', data)
            .then(res => {
                console.log({res})
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="transactions">Select transaction file:</label>

                <input type="file"
                    id="transactions"
                    name="transactions"
                    accept=".txt"
                    onChange={this.handleFileUpload}></input>

                <button type="submit">Submit</button>
            </form>
        )
    }
}