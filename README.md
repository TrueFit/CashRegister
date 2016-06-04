Cash Register
============

Installation
------------
``
npm install
``
Run It!
-------
``
npm start
``
After it starts, point your browser to `http://localhost:8090/`

Discussion
----------
Since we met at the React/Redux meetup, I decided to make my cash register a React component that uses a Redux store. It's actually two components that share a store: one that is interactive and one that accepts an input file.

In the interactive cash register, if you put in a value divisible by 3, click "Make Change" several times, you'll see the randomization change.
 
In the batch cash register, I didn't want to take any more time on this to use redux-thunk and do the file upload "right". So there is a 2-step process to work around asynchronous file loading.

For the batch cash register, there are two test files sitting in the /test directory if you want to use them. Or upload your own.

The "meat" of the app is in /src/js/utilities/register.js and all the functions in there have tests.
 
The UI is laid out with Bootstrap and is fully responsive.

Assumptions
-----------
Requirement 1 "Accept a flat file as input" is ambiguous. In the real world, I would ask
the product owner how they want to go about this. In my example, it is uploaded via a web form.

"Randomly generate change denominations" is also ambiguous. In my example, the app will 
randomly choose which denomination to start with, then which one is next, etc. until 
all change has been allocated.

Even the definition of "divisible by 3" can be confusing. For example, 3.33 clearly is,
and 2.18 clearly is not, but what about 2.34? The quotient is 0.78. Since we are dealing
with money, my definition is "multiply by 100 and then is it divisible by 3"?

The Problem
-----------
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. 
The function of the application is to tell the cashier how much change is owed, and what denominations should be used. 
In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. 
If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

Sample Input
------------
2.12,3.00

1.97,2.00

3.33,5.00

Sample Output
-------------
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

The Fine Print
--------------
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

