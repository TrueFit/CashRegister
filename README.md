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

## The Solution

This application is designed to imitate the structure of a physical cash register / monetary system.

At the lowest level is the Denomination (i.e. dollar, quarter, dime, nickel, penny). Denominations are connected by a Layout. Currently there is one Layout provided, US, which contains all the required Denominations. The set of Denominations is maintained by an Bank with a specified Layout.

From there, a Till can be setup to keep a record of counts for each Denomination, as defined by a Bank. Tills are used within a Transaction to store the change calculated from the amounts owed and received. Multiple Transactions are stored in a TransactionLedger. Finally, a Register can be setup for a desired Layout and holds the corresponding TransactionLedger.

At the moment, all of these classes have a specialized US type which represents the initial problem. USValues enumerates all the US-specific Denominations. USBank maintains all of those Denominations, and a USTill maintains counts for each of those Denominations. USTransaction handles the twist when the amount owed is divisble by 3, and shuffles the order of the Till. A USTransactionLedger simply propagates the US Layout down to the lower components. The factory container for each class constructs a type based on an input Layout.

This application can be expanded to have:
* Additional Denominations, with corresponding Layouts and Banks to manage those Denominations
* Till containing different set of Denominations
* Variety of Transactions with different twists or Till used
* A TransactionLedger which can manage multiple sets of Transactions, or other Layout

Also, aside from the listed sample input and output, two other cases are covered in the application

1. Not enough received
		Ex. 8.36,5.00
2. Exact amount owed is received
		Ex. 4.12,4.12

Both of these lead to an output of "No change due".

The solution is made up of multiple projects:
* __CashRegister.Core__ which contains the class models
* __CashRegister.Interfaces__ which contains the model interfaces
* __CashRegister.UnitTests__ which contains NUnit tests of all concrete classes
* __CashRegister.ConsoleApp__ which is a console-based interface for loading input, setting layout, and producing the desired output
* __CashRegister.UI__ which contains a simple WebForms application to load, display, and save transaction data
