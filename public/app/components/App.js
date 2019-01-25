import React from 'react';
import TransactionsForm from './TransactionsForm';
import ChangeTable from './ChangeTable';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            change: [],
            err: ""
        }

        this.updateChange = this.updateChange.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    updateChange(change) {
        this.setState({ 
            change,
            err: ""
        })
    }

    handleError(err) {
        this.setState({ 
            change: [],
            err
        })
    }

    render() {



        return (
            <main>
                <h1>Quirky Cash Register</h1>
                <TransactionsForm onSubmit={this.updateChange} onError={this.handleError} />
                { this.state.err && <p className="error">{this.state.err}</p> }
                { this.state.change.length > 0 && <ChangeTable change={this.state.change} />}
            </main>
        )
    }
}