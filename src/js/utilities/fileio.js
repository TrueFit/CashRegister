// let fs = require('fs');

/**
 * Read a file synchronously from the file system.
 * TODO - no error hadling for non-existent file.
 * @param file
 */
export const readFile = (file, returnResults) => {
    let reader = new FileReader();
    reader.onload = (e) => {
        returnResults(e.target.result);
    };
    reader.readAsText(file);
}

/**
 * Read the contents of a text file known to be in the following format.
 * TODO - no error handling for bad format
 * 12.45, 20.00
 * 3.98,5
 *
 * i.e. purchasePrice, amountTendered
 * @param raw string, lines of text
 * @returns [{purchaseAmount, tenderedAmount}]
 */
export const parseFile = (raw) => {
    let result = [];
    let lines = raw.split('\n');
    lines.forEach(l => {
        if (l.trim() != "") {
            result.push({
                purchaseAmount: l.split(',')[0],
                tenderedAmount: l.split(',')[1]
            })
        }
    })
    return result;
}
