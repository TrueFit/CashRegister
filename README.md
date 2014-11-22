Cash Register
============

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

Solution
--------

Code is written in scala.  A jar file `CashRegister.jar` has been built and put in the root directory.  It can be run with `java -jar CashRegister.jar`.  If you'd like to modify and run the altered code, you can install [sbt](http://www.scala-sbt.org/index.html) and [scala](http://www.scala-lang.org).

### Installation for Mac OS X

```bash
brew install scala
brew install sbt
```

### Using sbt

In the root of the directory type `sbt`.  This will drop you in an interactive console.  Typing `run` will compile and run the program, placing the `output.csv` file in the root directory.  If you modify the source code you can type `reload` to refresh the console session.  To run test you can use the `test` command.  You can also build a new jar file by typing `assembly`, which will place the file as `target/scala-2.11/CashRegister.jar`

### Thoughts, Critiques, and Future Features

This was a fun exercise.  I approached this with the thought that I could find a nice recursive solution and scala seemed like a good choice for that.  When I began coding this, I thought the code would be a bit more concise than it turned out to be.  I'm not fond of how I handled the mapping of denominations to human readable output as far as separating the singular and pluralized versions with a slash.  The calculateChange function turned out to be kind of ugly with the two inner function definitions.  It's also not as DRY as I would have liked it.  I think I could shorten it into one function but I believe I'd lose some of the readability.  It would have been slick if I could have implemented either providing a file name to the jar file or have it scan some directory for a list of files that a user could choose from, but I think this is an acceptable first pass.
