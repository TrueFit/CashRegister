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
    let files: any;
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            // this 'text' is the content of the file
            var text = reader.result;
            let inputs = text.split("\n");
            console.log(inputs);
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].length != 1) {    // checks that the string is NOT empty
                var splitValues = inputs[i].split(",");
                this.calculate(splitValues);
              }
            }
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
    var change = values[1] - values[0];
    console.log(change);
    var result = denominations.reduce(function(acc, next) {
      console.log(next.name)
      if (change >= next.value) {
        var currentValue = 0.00;
        while (change >= next.value && change >= 0) {
          currentValue ++;
          change -= next.value;
          change = Math.round(change * 100) / 100   // prevents nasty decimal issues in TypeScript
          console.log(change)
        }
        acc.push([next.name, currentValue]);
        console.log(acc)
        return acc
      } else {
        return acc
        console.log(acc)
      }
    }, []);
    return result
    console.log(result)
  }

}
