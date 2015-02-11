//
//  ChangeFileProcessor.swift
//  CashRegister
//
//  Build the pipeline to process a list of files, reading two values on each line and computing the change.
//

import Foundation

class ChangeFileProcessor {
    class func processFiles(files: [String]) {
        let lineReader = ValueReader().readTwoDollarValuesInPennies
        let computeChange = ChangeMaker().computeChange
        let r = Reporter()
        let fileProcessor = FileProcessor(lineReader: lineReader, valueProcessor: computeChange, reporter: r)
    
        fileProcessor.processFiles(files)
    }
}