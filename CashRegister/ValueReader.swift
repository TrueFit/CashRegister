//
//  ValueReader.swift
//  CashRegister
//
//  Created by Daniel Otto Abeshouse on 2015-1-24.
//  Copyright (c) 2015 Daniel Otto Abeshouse. All rights reserved.
//

import Foundation

class ValueReader {
    
    func readTwoDollarValuesInPennies(line: String) -> ReadValue<(Int, Int)> {
        let values = split(String(line)) {$0 == ","}
        if values.count != 2 {
            return ReadValue.Error("Incorrect number of values.")
        }
        
        switch readCentValue(values[0]) {
        case .Result(let firstPennies):
            switch readCentValue(values[1]) {
            case .Result(let secondPennies):
                return ReadValue.Result(firstPennies, secondPennies)
            case .Error(let error):
                return ReadValue.Error("Invalid second value: \(error)")
            }
        case .Error(let error):
            return ReadValue.Error("Invalid first value: \(error)")
        }
    }

    func readCentValue(num: String) -> ReadValue<Int> {
//    func readCentValue(num: String) -> Int? {
        let trimmedNumber = num.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        let values = split(trimmedNumber) {$0 == "."}
        if values.count > 2 {
            return ReadValue.Error("Incorrect currency format.")
        }
        if let dollarValue = values[0].toInt() {
            if values.count > 1 {
                if let centValue = values[1].toInt() {
                    if centValue < 100 {
                        return ReadValue.Result(100 * dollarValue + centValue)
                    }
                }
                return ReadValue.Error("Incorrect cent format.")
            } else {
                return ReadValue.Result(100 * dollarValue)
            }
        } else {
            return ReadValue.Error("Incorrect dollar format.")
        }
    }
    
    /*func error(message : String) {
        println("Error: \(message)")
    }*/
}
