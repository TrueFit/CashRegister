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
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
        let reader = new FileReader();
        reader.onload = () => {
            // this 'text' is the content of the file
            var text = reader.result;
            let inputs = text.split("\n")
            console.log(inputs)
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].length != 1) {    // checks that the string is NOT empty
                var splitValues = inputs[i].split(",")
                console.log(splitValues)
              }
            }
        }
        reader.readAsText(input.files[index]);
    };
  }

}
