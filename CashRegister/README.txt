Readme File

This program can be run using either command line paramters, or app.config parameters.

By default, I've setup debugging commanding line parameters in the project.  It searches for *.txt fils in the current executable bin folder.  It reads these txt files
and does the processing, and outputs into the an output.txt file in the current executable bin folder.  

If you wish to make the input and/or output directories different, either change it in the debugging part of the projects properties, or change it in the app.config. 

The app.config takes priority over the project command line parameters.  

I've included a sample input.txt file that gets copied to the bin folder.  