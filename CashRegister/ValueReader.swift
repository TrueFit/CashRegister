//
//  ValueReader.swift
//  CashRegister
//
//  Created by Daniel Otto Abeshouse on 2015-1-24.
//  Copyright (c) 2015 Daniel Otto Abeshouse. All rights reserved.
//

import Foundation

class ValueReader {
    
    func readTwoValues(line: String) -> (Int, Int)? {
        let values = split(String(line)) {$0 == ","}
        if values.count != 2 {
            error("Incorrect number of values.")
        } else {
            if let cost = readCentValue(values[0]) {
                if let payment = readCentValue(values[1]) {
                    return (cost, payment)
                } else {
                    error("Invalid payment.")
                }
            } else {
                error("Invalid cost.")
            }
        }
        return nil
    }
    
    func readCentValue(num: String) -> Int? {
        let values = split(String(num)) {$0 == "."}
        if values.count > 2 {
            error("Incorrect currency format.")
        } else {
            if let dollarValue = values[0].toInt() {
                if values.count > 1 {
                    if let centValue = values[1].toInt() {
                        return 100 * dollarValue + centValue
                    } else {
                        error("Incorrect cent format.")
                    }
                } else {
                    return 100 * dollarValue
                }
            } else {
                error("Incorrect dollar format.")
            }
        }
        return nil
    }
    
    func error(message : String) {
        println("Error: \(message)")
    }
}
