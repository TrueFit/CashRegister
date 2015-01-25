//
//  FileProcessor.swift
//  CashRegister
//
//  Processes a list of files line by line using two helpers:
//    A reader to interpret each line into values.
//    A processor to operate on those values when produced.
//

import Foundation

class FileProcessor<T> {
    let reader : (String)->(T?)
    let processor : (T)->()
    
    init(lineReader: (String)->(T?), valueProcessor: (T)->()) {
        reader = lineReader
        processor = valueProcessor
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
        if let lineValue = reader(line) {
            processor(lineValue)
        }
    }
}