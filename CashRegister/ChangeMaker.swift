//
//  ChangeMaker.swift
//  CashRegister
//

import Foundation

class ChangeMaker {
    
    // For each denomination there is penny value, singular name, and plural name
    let descendingDenominations = [
        (2000, "hamilton", "hamiltons"),
        (1000, "sawbuck", "sawbucks"),
        (500, "fiver", "fivers"),
        (100, "dollar", "dollars"),
        (25, "quarter", "quarters"),
        (10, "dime", "dimes"),
        (5, "nickel", "nickels"),
        (1, "penny", "pennies")
    ]
    
    func computeChange(price: Int, payment: Int) -> String {
        let pennyChange = payment - price
        return computeCoinChange(pennyChange, choice: (price % 3 == 0) ? randomCoin: greedyCoin)
    }
    
    // Takes all possible to minimize total pieces of change.
    private func greedyCoin(max: Int)->Int {
        return max
    }
    
    // Takes a random number of coins which will not produce a minimal result.
    private func randomCoin(max: Int)->Int {
        return Int(arc4random_uniform(UInt32(max+1)))
    }
    
    private func computeCoinChange(pennyChange: Int, choice: (Int)->(Int)) -> String {
        var pennies = pennyChange
        var changeDescription = ""
        for (value, single, plural) in descendingDenominations {
            if pennies >= value {
                let maxCount = pennies / value
                // When down to pennies take the rest, otherwise use the function
                let count = (value == 1 ? pennies : choice(maxCount))
                if (count > 0) {
                    pennies = pennies - (value * count)
                    changeDescription += "\(count) \(count==1 ? single : plural)"
                    if (pennies > 0) {
                        changeDescription += ", "
                    }
                }
            }
        }
        assert(pennies == 0, "There should be no change left")
        return changeDescription
    }
}