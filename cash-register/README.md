# CashRegister

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.1.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Setup and Testing

Run `npm install` to install dependencies. The easiest way to test the code would be to run `ng serve -o`. You may also need to allow pop-ups on localhost in order for the results file to download.

## Notes

99% of the magic happens in src/app/calculator/calculator.component. I chose to use Angular as opposed to a serverside language because I wanted to design the project in such a way that it functions as a utility tool for the customer. This code could easily be ported to accept files or JSON data through an API and run on the server as opposed to the client.

### Biggest Challenges

The biggest challenges on this challenge were A. the random denomination generator and B. parsing through all the data structures. I tried to keep the data format as consistent as possible to make parsing easy. The random denomination calculator also proved to be quite a challenge. I'm sure there's a more efficient way to filter out impossible combinations but since it's such a small data set, my brute force solution does the job.

### Biggest Victory

I was very satisfied with my solution for calculating the standard, most efficient denominations. The reducer eliminated a lot of complex iterating and math. I was also pleased with the denominations data structure and how it accounts for both singular and plural denomination names in generating the human readable strings.
