let fs = require('fs');
let inputFileName = 'sampleFile.txt';

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

function getChangeDue(currency, remainingBalance) {
  let selectedCurrency = currencyDenomination.filter(c => {
    return c.currency === currency;
  });

  let outputMessage = '';
  selectedCurrency[0].denomination
    .map(currentDenomination => {
      const currencyDecision = Math.floor(remainingBalance / currentDenomination.amount);
      if (currencyDecision > 0) {
        // Heads up: Had to use .toFixed because after the calculation, a rounding issue caused
        //           a problem in the calculation as the remaining balance was calculating as 0.009999999999999856
        //
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
  return outputMessage.replace(/\b,\s*$/, "");
}

// Read the sampleFile from disk and load each line into an Array that will be split by comma
let inputFileArray = fs.readFileSync(inputFileName).toString().split("\n");

inputFileArray.forEach((record => {
  let amountDue = record.split(',')[0];
  let amountPaid = record.split(',')[1];
  let customerOwed = amountPaid - amountDue;
  if (customerOwed > 0.00) {
    console.log(getChangeDue('US', customerOwed));
  } else if (customerOwed === 0) {
    console.log('No change due');
  } else {
    console.log('Customer still owes balance');
  }
}));
