import register from "../utilities/register";

const change = (state = {
    purchaseAmount: 0,
    tenderedAmount: 0
}, action) => {
    let newState = state;
    switch (action.type) {
        case 'MAKE_CHANGE':
            newState = Object.assign({}, state, {
                change: register.makeOptimalChange(state.purchaseAmount, state.tenderedAmount)
            });
            break;
    }
    return newState;
}

export default change
