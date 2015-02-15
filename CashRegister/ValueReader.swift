//
//  ValueReader.swift
//  CashRegister
//
//  Reads single lines for expected values, either returning the values or reporting any errors.
//  Initially only supports the reading of two dollar and cents values returned in pennies.
//

import Foundation

class ValueReader {
    
    func readTwoDollarValuesInPennies(line: String, reporter: Reporter) -> (Int, Int)? {
        let values = split(String(line)) {$0 == ","}
        if values.count != 2 {
            reporter.error("Incorrect number of values in '\(line)'.")
            return nil
        }
        
        var valueError : String?
        let firstPennies = readPennyValue(values[0], error: &valueError)
        if let firstError = valueError {
            reporter.error("Invalid first value - \(firstError)")
            return nil
        }
        
        let secondPennies = readPennyValue(values[1], error: &valueError)
        if let secondError = valueError {
            reporter.error("Invalid second value - \(secondError)")
            return nil
        }
        
        if let first = firstPennies {
            if let second = secondPennies {
                return (first, second)
            }
        }
        assert (false, "Will always get result or error and never reach here.")
        return nil
    }
    
    // Reads a single dollar value (e.g. 8 or 6.44) and converts it to integer pennies.
    // Does not use existing number parsing to avoid floats holding currencies.
    private func readPennyValue(num: String, inout error: String?) -> (Int?) {
        let trimmedNumber = num.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        let values = split(trimmedNumber) {$0 == "."}
        if values.count > 2 {
            error = "Incorrect currency format in '\(num)'."
            return nil
        }
        if let dollarValue = values[0].toInt() {
            if values.count > 1 {
                if let centValue = values[1].toInt() {
                    if centValue < 100 {
                        return 100 * dollarValue + centValue
                    }
                }
                error = "Incorrect cent format in '\(num)'."
                return nil
            } else {
                return 100 * dollarValue
            }
        } else {
            error = "Incorrect dollar format in '\(num)'."
            return nil
        }
    }
}
