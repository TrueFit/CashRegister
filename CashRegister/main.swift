//
//  main.swift
//  CashRegister
//
//  Check for presence of file arguments.
//  Exit if there are none otherwise invoke main process.
//

import Foundation


let argCount = Process.arguments.count
if (argCount == 1)
{
    println("Error: Please supply one or more file names.")
    exit(1)
}

// Skip first arg. It is the invoked program.
ChangeFileProcessor.processFiles(Array(Process.arguments[1..<argCount]))