import { Component, OnInit } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  read() {
    /* this function is responsible for reading the data from the uploaded file
    as well as parsing and passing the raw values to the appropriate calculation
    function */
    var resultArray = [];
    var input = event.target;    // the file from the UI element
    var reader = new FileReader();
    reader.onload = () => {
        var rawData = reader.result;
        let transactions = rawData.split("\n");   // returns an array of the owed/paid sets
        for (var i = 0; i < transactions.length; i++) {
          if (transactions[i].length != 1) {    // checks that the string is NOT empty (parsing can create empty strings)
            var splitTransactions = transactions[i].split(",");
            var change = splitTransactions[1] - splitTransactions[0]   // TODO add checks for negative/0 stuff here
            if ((splitTransactions[0] * 100) % 3 === 0) {   // checks if the amount owed is divisible by 3
              var randomResults = this.calculateRandom(change);    // passes values to random calculator
              resultArray.push(randomResults)
            } else {
              var standardResults = this.calculateStandard(change);    // passes values to standard calculator
              resultArray.push(standardResults);
            }
          }
        }
        this.write(resultArray);    // pass the results of the calculation to be written to a CSV
    }
    reader.readAsText(input.files[0]);    // triggers the file reader
  }


  calculateStandard(change) {
    /* this function calculates the standard change for a transaction (most efficent denominations) */
    // TODO make the denominations object a global variable or model
    var denominations = [
      {name: "twenty", plural: "twenties", value: 20.00},
      {name: "ten", plural: "tens", value: 10.00},
      {name: "five", plural: "fives", value: 5.00},
      {name: "one", plural: "ones", value: 1.00},
      {name: "quarter", plural: "quarters", value: 0.25},
      {name: "dime", plural: "dimes", value: 0.10},
      {name: "nickle", plural: "nickles", value: 0.05},
      {name: "penny", plural: "pennies", value: 0.01}
    ];
    var result = denominations.reduce(function(accumulator, currentDenomination) {   // iterates through the denomination object from top to bottom
      if (change >= currentDenomination.value) {
        var currentValue = 0.00;    // the amount of coins/bills for each denomination
        while (change >= currentDenomination.value) {
          currentValue ++;
          change -= currentDenomination.value;
          change = Math.round(change * 100) / 100   // prevents nasty decimal issues in TypeScript
        }
        if (currentValue > 1) {   // checks to see if the plural denomination name should be used or not
          accumulator.push({name: currentDenomination.plural, amount: currentValue});
        } else {
          accumulator.push({name: currentDenomination.name, amount: currentValue});
        }
        return accumulator;
      } else {
        return accumulator;
      }
    }, []);   // the empty array is the initial accumulator
    return result
  }

  calculateRandom(change) {
    /* this function calculates the randomized denominations if the amount
    due on a transaction is divisible by 3. It's not the most efficent randomization
    system, but it works well */
    let result = []
    var denominations = [
      {name: "twenty", plural: "twenties", value: 20.00},
      {name: "ten", plural: "tens", value: 10.00},
      {name: "five", plural: "fives", value: 5.00},
      {name: "one", plural: "ones", value: 1.00},
      {name: "quarter", plural: "quarters", value: 0.25},
      {name: "dime", plural: "dimes", value: 0.10},
      {name: "nickle", plural: "nickles", value: 0.05},
      {name: "penny", plural: "pennies", value: 0.01}
    ];
    var totalValue = 0
    while (totalValue < change) {
      var sameDenominationStatus = false;   // resets the same denomination catch for each iteration
      var randomDenomination = denominations[Math.floor(Math.random() * denominations.length)];   // selects a random denomination
      if (change >= randomDenomination.value) {   // makes sure the denomination is valid
        var denominationAmount = Math.floor((Math.random() * 10) + 1) // picks a random amount of the random denomination
        if (change >= (denominationAmount * randomDenomination.value) + totalValue && denominationAmount != 0) {    // makes sure the values are still valid
          totalValue += denominationAmount * randomDenomination.value
          totalValue = Math.round(totalValue * 100) / 100   // prevents nasty decimal issues
          for (var i = 0; i < result.length; i++) {   // combines duplicate denominations
            if (result[i].name == randomDenomination.name || result[i].name == randomDenomination.plural) {
              result[i].amount += denominationAmount;
              var sameDenominationStatus = true;
            }
          }
          if (sameDenominationStatus != true) {   // if the denomination is not a duplicate, we add it to the array
            if (denominationAmount > 1) {   // checks to use singular or plural name
              result.push({name: randomDenomination.plural, amount: denominationAmount})
            } else {
              result.push({name: randomDenomination.name, amount: denominationAmount})
            }
          }
        }
      }
    }
    return result
  }

  write(resultArray) {
    /* this function is responsible for concatenating the results into
    human readable format and then exporting the answers into a CSV */
    var options = {   // options for CSV export package
      headers: ["Transaction Number", "Change Due"]
    }
    let stringAnswers = []    // init our array of final, human readable answers
    let transactionCounter = 0    // matches each transaction with the appropriate answer line
    let csvContent = "data:text/csv;charset=utf-8,";
    for (var i = 0; i < resultArray.length; i++) {    // each iteration is one transaction
      transactionCounter ++
      let transactionString = ""
      for (var x = 0; x < resultArray[i].length; x++) {   // each iteration is one denomination of a transaction
        var string = resultArray[i][x].amount + " " + resultArray[i][x].name
        transactionString = transactionString + string + ",";
      }
      stringAnswers.push({transaction: transactionCounter, string: transactionString})
      console.log(stringAnswers)
    }
    // new Angular5Csv(stringAnswers, 'Results', options);   // third party package to generate the output CSV
  }

}
