export const makeChange = (purchaseAmount, tenderedAmount) => {
    return {
        type: 'MAKE_CHANGE',
        purchaseAmount: Number(purchaseAmount),
        tenderedAmount: Number(tenderedAmount)
    }
}

