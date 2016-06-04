import {makeChange} from "../utilities/register";

const change = (state = {
    purchaseAmount: 0,
    tenderedAmount: 0,
    change: {}
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
    }
    return newState;
}

export default change
