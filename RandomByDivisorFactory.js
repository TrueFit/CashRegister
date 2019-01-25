// This module is basically a factory that returns a function to check if a transaction is divisable by
// a given integer. This allows us to easily add this quirk but with numbers other than 3 (See bullet #1
// under Things To Consider)

function randomByDivisorFactory(divisor) {
    return function(transaction) { return transaction.owed*100%divisor === 0; }
}

module.exports = randomByDivisorFactory;