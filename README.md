# Cash Register

## The Solution
A Windows application to support Creative Cash Draw Solutions' problem outlined below. The general approach follows an MVVM architecture. There is a Settings page in which the user can dynamically adjust the divisor used for the "Random Twist" outlined in the problem below.

Later, if/when the client wishes to implement another language, the strings are mostly (if not all) stored within .resx files, which allow for an easy time to translate and have multiple files such as "Resources_en.resx", "Resources_fr.resx". On further consideration we would need to make is that in France the input may look different, and the regular expression used for verification may need update (e.g. "2,13" instead of "2.13" for a price).

A Service has been used to wrap the implementation of the multiple types of "IChangeGenerator" available. Within this service, a factory is used which makes a determination which implementation to employ. The factory's Create method accepts an "ISettings" type object as a parameter, which may be edited to contain data needed to resolve further implementations of the "IChangeGenerator".



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

*Remember the last one is random

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?