import React from 'react';
import axios from 'axios';

export default class TransactionsForm extends React.Component {
    constructor(props) {
        super(props);

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
        if(!this.state.transactionsList) {
            this.props.onError('No files were uploaded.');
        } else {
            const data = new FormData()
            data.append('file', this.state.transactionsList, this.state.transactionsList.name)

            axios.post('/transactionsList', data)
                .then(res => {
                    this.props.onSubmit(res.data.transactions);
                }, res => {
                    this.props.onError(res.response.data);
                })
        }
    }

    render() {
        return (
            <form className="transaction-form" onSubmit={this.handleSubmit}>
                <label htmlFor="transactions">Select transaction file:</label>
                <br />
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