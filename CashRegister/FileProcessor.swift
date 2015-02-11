//
//  FileProcessor.swift
//  CashRegister
//
//  Processes a list of files, line by line, using a pipeline of helper functions:
//    A reader to interpret each line into values.
//    A processor to operate on those values when produced.
//    An error reporter to record any problems.
//

import Foundation

public class FileProcessor<T> {
    let reader : (String)->(T?, String?)
    let processor : (T)->()
    let reporter: (String)->()
    
    init(lineReader: (String)->(T?, String?), valueProcessor: (T)->(), errorReporter: (String)->()) {
        reader = lineReader
        processor = valueProcessor
        reporter = errorReporter
    }
    

    public func processFiles(files: [String]) {
        for filename in files {
            processFile(filename)
        }
    }
    
    private func processFile(filename: String) {
        var error: NSError?
        if let fileContent = NSString(contentsOfFile: filename, encoding: NSUTF8StringEncoding, error: &error) {
            let lines = split(String(fileContent)) {$0 == "\n"}
            for line in lines {
                processLine(line)
            }
        }
        else {
            if let fileError = error {
                reporter("Could not process file '\(filename)' [\(fileError)]")
            }
        }
    }
    
    private func processLine(line: String) {
        let (lineResult, errorMessage) = reader(line)
        if let error = errorMessage {
            reporter(error)
        } else if let lineValue = lineResult {
            processor(lineValue)
        }
    }
}

