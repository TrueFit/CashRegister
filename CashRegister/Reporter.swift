//
//  Reporter.swift
//  CashRegister
//
//  A channel to report results and errors.
//  Isolates all output to a single class.
//

import Foundation

public class Reporter {
    public func success(message : String) {
        println("\(message)")
    }
    
    public func error(message : String) {
        println("Error: \(message)")
    }
}