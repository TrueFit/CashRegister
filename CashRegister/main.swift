//
//  main.swift
//  CashRegister
//
//  Created by Daniel Otto Abeshouse on 2015-1-11.
//  Copyright (c) 2015 Daniel Otto Abeshouse. All rights reserved.
//

import Foundation

let lastArg = Process.arguments.count - 1

if (lastArg < 1)
{
    println("Error: Please supply one or more file names.")
    exit(-1)
}

var files : [String] = Array(Process.arguments[1...lastArg])

let fileProcessor = FileProcessor()
let lineReader = ValueReader().readTwoValues
let computeChange = ChangeMaker().computeChange

fileProcessor.processFiles(files, lineReader, computeChange)