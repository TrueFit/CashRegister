//
//  main.swift
//  CashRegister
//
//  Exit if there are no file arguments, otherwise invoke ChangeFileProcessor.
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