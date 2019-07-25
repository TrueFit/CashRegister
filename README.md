# Cash Register

## The Solution
A Windows application to support Creative Cash Draw Solutions' problem outlined below. The general approach follows an MVVM architecture. 

There is a Settings page in which the user can dynamically adjust the divisor used for the "Random Twist" outlined in the problem below. There is the ability to edit the input via the application, although this will not edit the source file. This functionality can be turned off through the settings menu. Currently the only supported language for the application is only English, thus there is no ability to select the language at the moment.

The client may browse for a file to load into the application, which will then appear in the "Input" side of the main page. If the input is valid and well-enough shaped, then the "Generate Change" button will become available to the user. Upon pressing the "Generate Change" button, the input will be processed and the output will be displayed on the right side in accordance to the requirements layed out below.

Later, if/when the client wishes to implement another language, the strings are mostly (if not all) stored within .resx files, which allow for an easy time to translate and have multiple files such as "Resources_en.resx", "Resources_fr.resx". On further consideration we would need to make is that in France the input may look different, and the regular expression used for verification may need update (e.g. "2,13" instead of "2.13" for a price). For another language, in the ModelContainer we will need to register new, named dictionaries for the language's currency units, and resolve our implementation of the new language's "IChangeGenerator" with the appropriate dictionaries.

A Service has been used to wrap the implementation of the multiple types of "IChangeGenerator" available. Within this service, a factory is used which makes a determination as to which implementation to employ to generate our output string. The factory's Create method accepts an "ISettings" type object as a parameter, which may be edited to contain data needed to resolve further implementations of the "IChangeGenerator" beyond the initial two implementations.

Unit tests exist for the main functionality, while some functionality such as the File I/O requires some integration testing to ensure proper functionality. It is of my current opinion that I/O is hard to unit test reliably, as it can cause strange behavior. Though not 100% code coverage, I believe that what I have tested is the core functionality.

Currently there is no logging implemented in the application.

For installation, the setup file will be within the appropriate folder in the installer project folder. 

If opening through Visual Studio 207 or later, note that you must download and install the tool/extension for VS Installer Projects. Also, this project makes use of .Net Standard 2.0. This modification to support .Net Standard projects, if not already installed may need to be installed from the Visual Studio Installer or from the .Net Standard download website.

Thanks,

Joe Fallecker
jmfallecker@gmail.com

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