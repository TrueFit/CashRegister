import {makeChange, makeBulkChange} from "../utilities/register";
import {readFile, parseFile} from "../utilities/fileio";

// TODO - cheating on asynchronous file read as an expedient to avoid redux-thunk.
let changeInputs = [];
// let changeInputs = [{purchaseAmount: 2.36, tenderedAmount: 5.00}, {purchaseAmount: 10.85, tenderedAmount: 10.00}, {purchaseAmount: 43.17, tenderedAmount: 50.00}];

const change = (state = {
    purchaseAmount: 0,
    tenderedAmount: 0,
    change: {},
    changeInputs: [],
    changeOutputs: []
}, action) => {
    let newState = state;
    switch (action.type) {
        case 'MAKE_CHANGE':
            let change = makeChange(action.purchaseAmount, action.tenderedAmount) || {};
            newState = Object.assign({}, state, {
                purchaseAmount: action.purchaseAmount,
                tenderedAmount: action.tenderedAmount,
                change: change
            });
            break;
        case 'READ_FILE':
            readFile(action.textFile, (rawContents) => {
                changeInputs = parseFile(rawContents);
            });
            newState = Object.assign({}, state, {
                changeInputs: [],
                changeOutputs: []
            });
            break;
        case 'MAKE_BULK_CHANGE':
            // TODO - cheating on asynchronous file read as an expedient to avoid redux-thunk.
            let changeOutputs = makeBulkChange(changeInputs);
            newState = Object.assign({}, state, {
                changeInputs: changeInputs,
                changeOutputs: changeOutputs
            });
            break;
    }
    return newState;
}

export default change
