import { Component, OnInit } from '@angular/core';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  read() {
    let answerArray = [];
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            var text = reader.result;   // this 'text' is the content of the file
            let inputs = text.split("\n");
            console.log(inputs);
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].length != 1) {    // checks that the string is NOT empty
                var splitValues = inputs[i].split(",");
                var calculatedChange = this.calculate(splitValues);
                answerArray.push(calculatedChange);
              }
            }
            console.log(answerArray);
            this.write(answerArray);
        }
        reader.readAsText(input.files[index]);
    };
  }

  calculate(values) {
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
    if ((values[0] * 100) % 3 === 0) {
      this.calculateRandom(values);
    }
    var change = values[1] - values[0];   // get the difference between what is paid and owed
    var result = denominations.reduce(function(accumulator, currentDenomination) {   // iterates through the denomination object from top to bottom
      if (change >= currentDenomination.value) {
        var currentValue = 0.00;    // the amount of coins/bills for each denomination
        while (change >= currentDenomination.value && change >= 0) {    //TODO remove redundant check here
          currentValue ++;
          change -= currentDenomination.value;
          change = Math.round(change * 100) / 100   // prevents nasty decimal issues in TypeScript
        }
        if (currentValue > 1) {   // checks to see if the plural denomination name should be used or not
          accumulator.push([currentDenomination.plural, currentValue]);
        } else {
          accumulator.push([currentDenomination.name, currentValue]);
        }
        return accumulator;
      } else {
        return accumulator;
      }
    }, []);
    return result
  }

  calculateRandom(values) {
    let results = []
    console.log("random");
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
    var change = values[1] - values[0];
    console.log(change)
    var totalValue = 0
    while (totalValue < change) {
      var randomDenomination = denominations[Math.floor(Math.random() * denominations.length)];   // selects a random denomination
      if (change >= randomDenomination.value) {
        var denominationAmount = Math.floor(Math.random() * 10)
        if (change >= (denominationAmount * randomDenomination.value) + totalValue && denominationAmount != 0) {
          totalValue += denominationAmount * randomDenomination.value
          totalValue = Math.round(totalValue * 100) / 100
          results.push(randomDenomination.name, denominationAmount)
        }
      }
    }

  }

  write(answerArray) {
    var options = {
      headers: ["Transaction Number", "Change Due"]
    }
    let answerObject = []
    let stringAnswers = []
    let transactionCounter = 0
    let csvContent = "data:text/csv;charset=utf-8,";
    // TODO not the most graceful solution, use objects instead?
    for (var i = 0; i < answerArray.length; i++) {    // each iteration is one transaction
      // console.log(answerArray[i])
      transactionCounter ++
      let transactionString = ""
      for (var x = 0; x < answerArray[i].length; x++) {   // each iteration is one denomination of a transaction
        var string = answerArray[i][x][1] + " " + answerArray[i][x][0]
        transactionString = transactionString + string + ",";
      }
      stringAnswers.push({transaction: transactionCounter, string: transactionString})
      console.log(stringAnswers)
    }
    // new Angular5Csv(stringAnswers, 'Results', options);   // third party package to generate the output CSV
  }

}
