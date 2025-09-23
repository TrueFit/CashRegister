export default class ChangeMethod {
    isApplicable = (owed) => {
        throw new Error("Method isApplicable not implemented");
    }
    
    calculateChange = (owed, paid, denominations) => {
        throw new Error("Method calculateChange not implemented");
    }
}