const DENOMINATIONS = [100, 25, 10, 5, 1];

/**
 * Returns an object representing either (a) the minimal number of dollars, quarters, etc to make change
 * based on the purchase and the tendered amount, or (b) a randomized set of denominations that is still
 * correct change
 *
 * Choose (b) when the purchase amount is evenly divisible by 3, otherwise use (a)
 *
 * @param purchaseAmount
 * @param tenderedAmount
 * @returns {*|number}
 */
export const makeChange = (purchaseAmount, tenderedAmount) => {
    if (isNaN(purchaseAmount) || isNaN(tenderedAmount)) {
        return null;
    }
    let changeAmount = tenderedAmount - purchaseAmount;
    if (changeAmount <= 0) {
        return null;
    }
    if ((purchaseAmount * 100) % 3 == 0) {
        return makeChangeWithRandomDenominations(changeAmount)
    }
    else {
        return makeOptimalChange(changeAmount)
    }
}

/**
 * Returns an object representing the minimal number of dollars, quarters, etc to make change
 * based on the purchase and the tendered amount
 *
 * @param purchaseAmount
 * @param tenderedAmount
 * @returns {*|number}
 */
export const makeOptimalChange = (changeAmount) => {
    let remainder = Math.round(changeAmount * 100);
    let denomCounts = DENOMINATIONS.map(d => {
        let tempResult = getDenominationCount(remainder, d);
        remainder = tempResult.remainder;
        return tempResult.denomCount;
    });
    return convertToChangeObject(denomCounts);
}

/**
 * Returns an object representing the correct number of dollars, quarters, etc to make change
 * based on the change amount, but with a twist: the denominations are to be chosen randomly.
 * For the change, choose a denomination at random and figure it out. Then choose the next denomination
 * at random, and so on until the change is completely allocated.
 *
 * @param changeAmount
 * @returns {*|number}
 */
export const makeChangeWithRandomDenominations = (changeAmount) => {
    let remainder = changeAmount * 100;
    let denomCounts = [0, 0, 0, 0, 0];
    let denomInds = [0, 1, 2, 3, 4];
    while (denomInds.length) {
        // Grab an index from 0-4 at random, then throw away that index
        let randomInt = Math.floor(Math.random() * denomInds.length);
        let randomIndex = denomInds[randomInt];
        denomInds.splice(randomInt, 1);

        // Compute the denomination count in the normal way
        let tempResult = getDenominationCount(remainder, DENOMINATIONS[randomIndex]);
        remainder = tempResult.remainder;
        denomCounts[randomIndex] = tempResult.denomCount;
    }
    return convertToChangeObject(denomCounts);
}


/**
 * Returns the highest number of the given denomination to return in change without going over.
 * @param input
 * @param denom
 * @returns {{numberOfCoins: number, remainder: number}}
 */
export const getDenominationCount = (input, denom) => {
    return {
        denomCount: Math.floor(input / denom),
        remainder: input % denom
    }
}

const convertToChangeObject = (denomCounts) => ({
    dollars: denomCounts[0],
    quarters: denomCounts[1],
    dimes: denomCounts[2],
    nickels: denomCounts[3],
    pennies: denomCounts[4]
})


