To use:

This program will take in an input file on the command line or default to tests.txt if no input is given.

It will output the most efficient change needed in most cases, unless the total cost of the items is evenly divisble by three. In this case, it will give a random amount of change.

Classes
===

Change
---
This class can be used to give back a string describing the correct change by using GetChange and supplying it two decimals, the register total that is to be paid and the total paid.

ex Change.GetChange(1, 5) will return the following string: 4 ones

Currencies
---
This class holds the list of currencies that are available. This list can be altered, as long as the list is still in order from largest to smallest.

Currency
---
A data structure that holds the singular and plural names of individual currencies along with the value of the currency. Includes a helper function to return the proper pluralization when requesting the name.