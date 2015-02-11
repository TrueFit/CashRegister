//
//  ValueReader.swift
//  CashRegister
//

import Foundation

public class ValueReader {
    
    public func readTwoDollarValuesInPennies(line: String) -> ((Int, Int)?, String?) {
        let values = split(String(line)) {$0 == ","}
        if values.count != 2 {
            return (nil, "Incorrect number of values in '\(line)'.")
        }
        
        let (firstPennies, firstError) = readPennyValue(values[0])
        if let error = firstError {
            return (nil, "Invalid first value - \(error)")
        }
        
        let (secondPennies, secondError) = readPennyValue(values[1])
        if let error = secondError {
            return (nil, "Invalid second value - \(error)")
        }
        
        if let first = firstPennies {
            if let second = secondPennies {
                return ((first, second), nil)
            }
        }
        assert (false, "Will always get result or error and never reach here.")
        return (nil, "Will not reach here.")
    }

    private func readPennyValue(num: String) -> (Int?, String?) {
        let trimmedNumber = num.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        let values = split(trimmedNumber) {$0 == "."}
        if values.count > 2 {
            return (nil, "Incorrect currency format in '\(num)'.")
        }
        if let dollarValue = values[0].toInt() {
            if values.count > 1 {
                if let centValue = values[1].toInt() {
                    if centValue < 100 {
                        return (100 * dollarValue + centValue, nil)
                    }
                }
                return (nil, "Incorrect cent format in '\(num)'.")
            } else {
                return (100 * dollarValue, nil)
            }
        } else {
            return (nil, "Incorrect dollar format in '\(num)'.")
        }
    }
}
