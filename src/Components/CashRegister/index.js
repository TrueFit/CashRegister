import React, {Component} from 'react';
import DENOMINATIONS from "./denominations";
import {checkRandomDivisible, parseCSV, roundedDecimal, getRandomArbitrary} from "../../Utils";

const TEST_FILE = "11.0, 20.0\n8.5, 10.0\n3.0, 6.0\n13.42, 16.00\n55.63, 106.0";

// What might happen if sales closes a new client in France?
// "locale" property will allow us to filter what we need by location
const CASH_REGISTER = {
    dollar: DENOMINATIONS.filter(k => k.name === "dollar" && k.locale === "US")[0],
    quarter: DENOMINATIONS.filter(k => k.name === "quarter" && k.locale === "US")[0],
    dime: DENOMINATIONS.filter(k => k.name === "dime" && k.locale === "US")[0],
    nickle: DENOMINATIONS.filter(k => k.name === "nickle" && k.locale === "US")[0],
    penny: DENOMINATIONS.filter(k => k.name === "penny" && k.locale === "US")[0]
};

class CashRegister extends Component {
    constructor() {
        super();
        this.state = {
            transactions: TEST_FILE,
            randomDivisor: 3
        };
    }

    getOverrides(override, value) {
        let newValue = value;
        override.forEach(thisOverride => {
            if (thisOverride.active === true && "randomDivisible" === thisOverride.type) {
                let randomDifference = getRandomArbitrary(0.01, value);
                newValue = roundedDecimal(randomDifference);
            }
        });
        return newValue;
    }

    // What might happen if the client needs to add another special case (like the random twist)?
    checkOverrides = value => {
        return [
            {
                active: checkRandomDivisible(value, this.state.randomDivisor),
                type: "randomDivisible"
            }
        ];
    }

    // Returns the closest denomination from the value param
    getDenomination(value, override) {
        let thisValue = value; // Don't mutate params
        let result = null;
        // Check if there are any custom actions
        thisValue = this.getOverrides(override, thisValue);

        // Find best match for each value
        DENOMINATIONS.forEach((denomination, i) => {
            if (thisValue >= denomination.value && !result) {
                result = DENOMINATIONS.find(res => res.value === denomination.value);
            }
        });
        return result;
    }

    getUserChange(transaction) {
        const result = [];
        let value = roundedDecimal(transaction.paid - transaction.owed); // determine what is owed
        const override = this.checkOverrides(value); // check overrides at the beginning of each transaction

        // get user's change for transaction
        while (value > 0) {
            const denomination = this.getDenomination(value, override); // returns denomination object {name, value}
            const remainder = value - denomination.value; // Update Difference
            value = roundedDecimal(remainder);
            result.push(denomination.name); // Push user's change to array until we reach 0
        }

        // console.warn("Result: ", result);
        return result;
    }

    /* Render Methods */
    // What might happen if the client needs to change the random divisor?
    renderRandomDivisorInput = () => (
        <form>
            <h1>Set Random Divisor</h1>
            <input
                onChange={e => this.setState({randomDivisor: e.target.value})}
                value={this.state.randomDivisor}
            />
        </form>
    );

    renderTransaction(thisTransaction) {
        const result = [];
        // Map each transaction to currency
        DENOMINATIONS.forEach((denomination, index) => {
            const quantity = thisTransaction.filter(res => res === denomination.name).length;
            if (!quantity) {
                return;
            }

            result.push(
                <li
                    key={`transaction-${index}`}
                    className="visible">
                    <b>{quantity}</b>
                    <p>
                        {
                            quantity > 1
                                ? CASH_REGISTER[denomination.name].plural
                                : CASH_REGISTER[denomination.name].name}
                    </p>
                </li>
            );
        });
        return result;
    }

    renderAllTransactions = (transactions) => (
        transactions.map((thisTransaction, index) => {
            const result = this.getUserChange(thisTransaction);
            return (<ul key={`transaction-container-${index}`}>{this.renderTransaction(result)}</ul>);
        })
    )

    render() {
        const {transactions} = this.state;
        const allTransactions = parseCSV(transactions);
        return (
            <React.Fragment>
                <section>
                    <h1>Transactions</h1>
                    <textarea onChange={(e) => this.setState({transactions: e.target.value})} value={this.state.transactions}/>
                    {this.renderRandomDivisorInput()}
                </section>
                <section>
                    <h1>Output</h1>
                    {this.renderAllTransactions(allTransactions)}
                </section>
            </React.Fragment>
        );
    }
}

export default CashRegister;
