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

class FileProcessor<T> {
    let read : (String, Reporter)->(T?)
    let process : (T)->(String)
    let report: Reporter
    
    init(lineReader: (String, Reporter)->(T?), valueProcessor: (T)->(String), reporter: Reporter) {
        read = lineReader
        process = valueProcessor
        report = reporter
    }


    func processFiles(files: [String]) {
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
                report.error("Could not process file '\(filename)' [\(fileError)]")
            }
        }
    }
    
    private func processLine(line: String) {
        if let lineValue = read(line, report) {
            report.success(process(lineValue))
        }
    }
}

