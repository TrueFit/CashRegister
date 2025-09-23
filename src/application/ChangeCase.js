export default class ChangeCase {
    constructor(Currency, Method) {
        this.currency = Currency;
        this.method = Method;
    }

    calculateChange = (owed, paid) => {
        const denominations = this.currency.getDenominations();
        return this.method.calculateChange(owed, paid, denominations);
    }
}