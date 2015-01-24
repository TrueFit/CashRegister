//
//  FileProcessor.swift
//  CashRegister
//
//  Created by Daniel Otto Abeshouse on 2015-1-11.
//  Copyright (c) 2015 Daniel Otto Abeshouse. All rights reserved.
//

import Foundation

class FileProcessor {
    func processFiles<T>(files: [String], lineReader: (String)->(T?), helper: (T)->()) {
        for filename in files {
            processFile(filename, lineReader: lineReader, helper: helper)
        }
    }
    
    func processFile<T>(filename: String, lineReader: (String)->(T?), helper: (T)->()) {
        var error: NSError?
        if let fileContent = NSString(contentsOfFile: filename, encoding: NSUTF8StringEncoding, error: &error) {
            let fileLines = String(fileContent)
            let lines = split(String(fileLines)) {$0 == "\n"}
            for line in lines {
                if let lineValue = lineReader(line) {
                    helper(lineValue)
                }
            }
        }
        else {
            if  let fileError = error {
                println("Error processing \(filename) [\(fileError)]")
            }
        }
    }
}