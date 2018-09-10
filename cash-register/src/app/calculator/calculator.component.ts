import { Component, OnInit } from '@angular/core';

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
                answerArray.push(calculatedChange)
              }
            }
            console.log(answerArray);
            this.write(answerArray);
        }
        reader.readAsText(input.files[index]);
    };
  }

  calculate(values) {
    var denominations = [
      {name: "twenty", value: 20.00},
      {name: "ten", value: 10.00},
      {name: "five", value: 5.00},
      {name: "one", value: 1.00},
      {name: "quarter", value: 0.25},
      {name: "dime", value: 0.10},
      {name: "nickle", value: 0.05},
      {name: "penny", value: 0.01}
    ];
    var change = values[1] - values[0];   // get the difference between what is paid and owed
    var result = denominations.reduce(function(accumulator, currentDenomination) {   // iterates through the denomination object from top to bottom
      console.log(currentDenomination.name)
      if (change >= currentDenomination.value) {
        var currentValue = 0.00;    // the amount of coins/bills for each denomination
        while (change >= currentDenomination.value && change >= 0) {
          currentValue ++;
          change -= currentDenomination.value;
          change = Math.round(change * 100) / 100   // prevents nasty decimal issues in TypeScript
        }
        accumulator.push([currentDenomination.name, currentValue]);
        return accumulator
      } else {
        return accumulator
      }
    }, []);
    // console.log(result)
    return result
  }

  write(answerArray) {
    let csvContent = "data:text/csv;charset=utf-8,";
    // TODO: not the most graceful solution, use objects instead?
    for (var i = 0; i < answerArray.length; i++) {    // each iteration is one transaction
      console.log(answerArray[i])
      for (var x = 0; x < answerArray[i].length; x++) {   // each iteration is one denomination of a transaction
        var string = answerArray[i][x][1] + " " + answerArray[i][x][0]
        var transactionString = transactionString + " " + string;
        console.log(transactionString)
      }
    }
    // rows.forEach(function(rowArray){
    //   let row = rowArray.join(",");
    //   csvContent += row + "\r\n";
    // });
    // var encodedUri = encodeURI(csvContent);
    // window.open(encodedUri);
  }

}
