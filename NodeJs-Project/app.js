const inputFileName = 'sampleFile.txt';
const randomizeWhenDivisibleBy = 3;

const fs = require('fs');
const divisible = require('divisible');

const currencyDenomination = [
  {'currency': 'US',
    'denomination': [
      {'amount': 100, name: 'one hundred dollar' },
      {'amount': 50, name: 'fifty dollar' },
      {'amount': 20, name: 'twenty dollar' },
      {'amount': 10, name: 'ten dollar' },
      {'amount': 5, name: 'five dollar' },
      {'amount': 1, name: 'dollar' },
      {'amount': .25, name: 'quarter' },
      {'amount': .1, name: 'dime' },
      {'amount': .05, name: 'nickels' },
      {'amount': .01, name: 'pennies' },
    ]
  }
];

function randomizeCurrencyArray(array) {
  for (let index = array.length - 1; index > 0; index--) {
    const randomArrayIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomArrayIndex]] = [array[randomArrayIndex], array[index]];
  }
}

function getChangeDue(currency, remainingBalance, randomize) {
  let selectedCurrency = currencyDenomination.filter(c => {
    return c.currency === currency;
  })[0].denomination;

  let sourceCurrencyMapping = selectedCurrency;
  if (randomize) {
    let selectedCurrency = randomizeCurrencyArray(sourceCurrencyMapping);
  }

  let outputMessage = '';
  sourceCurrencyMapping
    .map(currentDenomination => {
      // Heads up: Had to use .toFixed because after the calculation, a rounding issue caused
      //           a problem as the remaining balance was calculating as 0.009999999999999856
      //
      const currencyDecision = Math.floor(remainingBalance / currentDenomination.amount);
      if (currencyDecision > 0) {
        remainingBalance = (remainingBalance - (currencyDecision * currentDenomination.amount)).toFixed(2);
        return {
          'qty': currencyDecision,
          'denomination': currentDenomination.name
        };
      }
    })
    .filter(a => typeof a !== 'undefined')
    .forEach(change => {
      return outputMessage += change.qty + ' ' + change.denomination + ', ';
    });

  // Remove any trailing comma and space from the result
  return outputMessage.replace(/\b,\s*$/, "");
}

// Read the sampleFile from disk and load each line into an Array that will be split by comma
let inputFileArray = fs.readFileSync(inputFileName).toString().split("\n");

let outputArray = [];
// Loop over each line within the text file and then split each row on a comma to be passed to function
inputFileArray.forEach((record => {
  let amountDue = parseFloat(record.split(',')[0]);
  let amountPaid = parseFloat(record.split(',')[1]);
  let customerOwed = amountPaid - amountDue;
  if (customerOwed > 0.00  ) {
    let results = getChangeDue('US', customerOwed, divisible(amountDue, randomizeWhenDivisibleBy));
    outputArray.push({ 'amountDue': amountDue, 'amountPaid': amountPaid, 'change': results, 'randomize': divisible(amountDue, randomizeWhenDivisibleBy) })
  } else if (customerOwed === 0) {
    outputArray.push({ 'amountDue': amountDue, 'amountPaid': amountPaid, 'change': 'No change due', 'randomize': false});
  } else {
    outputArray.push({ 'amountDue': amountDue, 'amountPaid': amountPaid, 'change': 'Customer still owes a balance', 'randomize': false});
  }
}));

outputArray.forEach( row => {
  console.log("%s (Due: %d / Paid: %d) Randomize: %s", row.change, row.amountDue, row.amountPaid, row.randomize);
});

