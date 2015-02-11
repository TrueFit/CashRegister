//
//  ChangeFileProcessor.swift
//  CashRegister
//
//  Build the pipeline to process a list of files, reading two values on each line and computing the change.
//

import Foundation

public class ChangeFileProcessor {
    public class func processFiles(files: [String]) {
        let lineReader = ValueReader().readTwoDollarValuesInPennies
        let computeChange = ChangeMaker().computeChange
        let fileProcessor = FileProcessor(lineReader: lineReader, valueProcessor: computeChange, errorReporter: writeError)
    
        fileProcessor.processFiles(files)
    }
    
    private class func writeError(message : String) {
        println("Error: \(message)")
    }
}