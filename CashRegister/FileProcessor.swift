//
//  FileProcessor.swift
//  CashRegister
//
//  Processes a list of files line by line using two helpers:
//    A reader to interpret each line into values.
//    A processor to operate on those values when produced.
//

import Foundation

enum ReadValue<T> {
    case Result(T)
    case Error(String)
}

class FileProcessor<T> {
    let reader : (String)->(ReadValue<T>)
    let processor : (T)->()
    let reporter: (String)->()
    
    init(lineReader: (String)->(ReadValue<T>), valueProcessor: (T)->(), errorReporter: (String)->()) {
        reader = lineReader
        processor = valueProcessor
        reporter = errorReporter
    }
    
    func processFiles(files: [String]) {
        for filename in files {
            processFile(filename)
        }
    }
    
    func processFile(filename: String) {
        var error: NSError?
        if let fileContent = NSString(contentsOfFile: filename, encoding: NSUTF8StringEncoding, error: &error) {
            let lines = split(String(fileContent)) {$0 == "\n"}
            for line in lines {
                processLine(line)
            }
        }
        else {
            if let fileError = error {
                println("Error processing \(filename) [\(fileError)]")
            }
        }
    }
    
    func processLine(line: String) {
        let lineResult = reader(line)
        switch lineResult {
            case .Result(let lineValue):
                processor(lineValue)
            case .Error(let error):
                reporter(error)
        }
            
        /*if let lineValue = reader(line) {
            processor(lineValue)
        }*/
    }
}

Unimplemented IR generation feature non-fixed multi-payload enum layout