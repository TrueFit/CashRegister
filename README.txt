Nathaniel Hupp - TrueFit Case Register

Project Specs:
Winforms Format
.Net Core 5
C#

Built in Visual Studio 19

Need To Run:
Very Besic WinForm Application. Should not need any extra dependencies other than the standard .Net Core 5

How To Run:
1. Open Solution in Visual Studio
2. Build Application
3. Run Application
4. Select Source File
5. Select Currency
6. Press "Compute All"

Additioanl Options:
* The Randomizer can be adjusted for different integers
* Can round up the change up to the next dollar amount to donate to charity


Project Problem:
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

Accept a flat file as input
Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
Expect that there will be multiple lines
Output the change the cashier should return to the customer
The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
Each new line in the input file should be a new line in the output file

