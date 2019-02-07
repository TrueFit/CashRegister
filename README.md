# Cash Register

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random*

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?

# Solution

The solution implemented here consists of a website which allows the user to upload a file as described above. The change-calculating logic is contained within a separate service on the back end.

The front end is an Angular 7 application meant to be viewed in the browser. The back end is an Express server run with Node.js.

## Building and Running

### Prerequisites

To build and run this application, you will need Node.js and `npm`.

### Building

Run `npm install` in both the `frontend/` and `backend/` directories. You can then build the front end or back end by running `npm run build` in its respective directory.

If `npm` warns about any missing peer dependencies, you may have to install those manually.

### Running

To start up a server on `localhost` for the frontend or backend, run `npm run serve` in its respective directory. You will need both the front end and back end running.

When the front-end server is running, you can view the UI at <http://localhost:4200>. From there you can upload a file in the format described in this README, such as the following:

```
2.12,3.00
1.97,2.00
3.33,5.00
3.00,5.00
```

Results will be shown on the page.
