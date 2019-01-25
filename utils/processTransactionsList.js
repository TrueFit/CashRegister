// This module serves as a simple utility that takes in a text file of transactions and returns 
// data that in a more easily digestable shape in the form of a promise. Because this module takes
// a file, we can do file type and data validation here and return errors accordingly. Doing all of
// this in a utility lets us keep file reading logic out of our REST API.

// Transaction data is returned as an array of objects with this shape
// {
//     owed: 12.34,
//     paid: 56.78
// }

const rl = require('readline');
const fs = require('fs');
const { Readable } = require('stream');

function processTransactionsList(file) {

    return new Promise((resolve, reject) => {

        const transactions = [];

        // Check for incorrect file type
        if (file.mimetype !== 'text/plain') {
            reject('File is incorrect file type. File must be .txt');
        }

        // Creates a readable stream from the Buffer. Because we aren't putting this file on disk,
        // we can't use fs.createReadStream.
        const readStream = new Readable();
        readStream.push(file.data);
        readStream.push(null);
    
        const readLine = rl.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });
    
        // For every line, push the data into our transactions array
        readLine.on('line', (line) => {
            const [owed, paid] = line.split(',').map(amount => parseFloat(amount));
            transactions.push({ owed, paid })
        });

        // Hitting the end of the file automatically closes the stream so we can use this event
        // to call resolve
        readLine.on('close', (line) => {
            resolve(transactions)
        });
    })

}

module.exports = processTransactionsList;