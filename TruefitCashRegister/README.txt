Steve Faurie
Truefit exercise
3.4.17

This program was written and tested on a pc running windows 10.

The easiest way to see it would be to use visual studio and just run it through the debugger.  

To start the program first click the button labeled "Open Price and Payment File"
	Results can be previewed in the window below.
Next click calculate results
	A window will pop up asking where to save the output file.
	Results can be previewed within the application in the bottom window or examined in the saved file.


Most of the code you'll likely be interested in is in the ChangeCalculator project.  The idea was to create a mini library for this task.

The TruefitCashRegister project is a winforms interface that will allow you to interact with the change calculator.  The model objects are shared
between the two projects.