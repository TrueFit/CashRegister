//
//  ChangeMaker.swift
//  CashRegister
//
//  Created by Daniel Otto Abeshouse on 2015-1-11.
//  Copyright (c) 2015 Daniel Otto Abeshouse. All rights reserved.
//

import Foundation

class ChangeMaker {
    
    // Descending order allows for minimum change
    let denominations = [
        (2000, "hamilton", "hamiltons"),
        (1000, "sawbuck", "sawbucks"),
        (500, "fiver", "fivers"),
        (100, "dollar", "dollars"),
        (25, "quarter", "quarters"),
        (10, "dime", "dimes"),
        (5, "nickel", "nickels"),
        (1, "penny", "pennies")
    ]
    
    func computeChange(price: Int, payment: Int) {
        let pennyChange = payment - price
        if price % 3 == 0 {
            computeCoinChange(pennyChange, randomCoin)
        } else {
            computeCoinChange(pennyChange, greedyCoin)
        }
    }
    
    func computeCoinChange(pennyChange: Int, choice: (Int)->(Int)) {
        var pennies = pennyChange
        for (value, single, plural) in denominations {
            if pennies >= value {
                let maxCount = pennies / value
                // When down to pennies take the rest, otherwise use the function
                let count = (value == 1 ? pennies : choice(maxCount))
                if (count > 0) {
                    pennies = pennies - (value * count)
                    print("\(count) \(count==1 ? single : plural)")
                    if (pennies > 0) {
                        print(", ")
                    }
                }
            }
        }
        println()
        assert(pennies == 0, "There should be no change left")
    }
    
    func greedyCoin(max: Int)->Int {
        return max
    }
    
    func randomCoin(max: Int)->Int {
        return Int(arc4random_uniform(UInt32(max+1)))
    }
}