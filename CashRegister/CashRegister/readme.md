To use:

This program will take an input file as the first argument on the command line or wait for a user to put in a file name if no arguments are given.

The format of the input file is individual lines with the total cost and total amount paid separated by a comma.

Sample input:<br/>
2.12,3.00<br/>
1.97,2.00<br/>
3.33,5.00

It will output the most efficient denominations of change, unless the total cost of the items is evenly divisible by three ($9, $3.27, etc.). In this case, it will give random denominations of change.

Sample output:<br/>
3 quarters,1 dime,3 pennies<br/>
3 pennies<br/>
1 dollar,1 quarter,6 nickels,12 pennies<br/>

*Remember the last one is random

Classes
===

Change
---
This class can be used to give back a string describing the correct change by using GetChange and supplying it two decimals, the register total that is to be paid and the total paid.

ex: Change.GetChange(1, 5) will return the following string: 4 ones

Currencies
---
This class holds the list of currencies that are available. Defaults to blank so users must either call CreateDefaultCurrencies() or add their own list. New entries can be added to this list and it will be automatically sorted properly.

Currency
---
A data structure that holds the singular and plural names of individual currencies along with the value of the currency. Includes a helper function to return the proper pluralization when requesting the name.

RegisterTransaction
---
A data structure that holds the total, paid amount and resultant change as a string.