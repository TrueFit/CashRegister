Cash Register
============

The Solution
------------

Josh, The files are uploaded and ready to be looked at.  To run teh code you just have to run php start.php input.rxt (or whatever flatfile you want to test with.)  Per the
instructions I assumed that this was part of a bigger system so the start script just handles autoloading and looping through the input file and calling the cashRegister class.  Output is sent
sent back as an array and a hacked together "view" outputs the data to the screen.  AGain, I assumed there would be real view management in the "real" system so I did not
address it here in my solution.  Looking forward to your feedback.

Let me know if you have questions.  You can get me direct at scottmadeira@gmail.com

Scott

The Problem
-----------
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

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