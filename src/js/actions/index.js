export const makeChange = (purchaseAmount, tenderedAmount) => {
    return {
        type: 'MAKE_CHANGE',
        purchaseAmount: purchaseAmount,
        tenderedAmount: tenderedAmount
    }
}

