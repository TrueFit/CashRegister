import expect from "expect";
import {
    getDenominationCount,
    makeChange,
    makeOptimalChange,
    makeChangeWithRandomDenominations,
    makeBulkChange
} from "../../src/js/utilities/register";

describe('register utilities', () => {
    it('should handle basic math', () => {
        expect(
            getDenominationCount(100, 10)
        ).toEqual({
            denomCount: 10,
            remainder: 0
        })
    })

    it('should also handle basic math', () => {
        expect(
            getDenominationCount(123, 25)
        ).toEqual({
            denomCount: 4,
            remainder: 23
        })
    })

    it('should make optimal change', () => {
        expect(
            makeOptimalChange(7.66)
        ).toEqual({
            dollars: 7,
            quarters: 2,
            dimes: 1,
            nickels: 1,
            pennies: 1
        })
    })

    it('should also make optimal change', () => {
        expect(
            makeOptimalChange(1.54)
        ).toEqual({
            dollars: 1,
            quarters: 2,
            dimes: 0,
            nickels: 0,
            pennies: 4
        })
    })

    it('should handle rounding property', () => {
        expect(
            makeOptimalChange(76.6)
        ).toEqual({
            dollars: 76,
            quarters: 2,
            dimes: 1,
            nickels: 0,
            pennies: 0
        })
    })

    it('should make random change totalling 6.54', () => {
        let change = makeChangeWithRandomDenominations(6.54);
        expect(
            (change.dollars * 1.0 + change.quarters * 0.25 + change.dimes * 0.1 + change.nickels * 0.05 + change.pennies * 0.01).toFixed(2)
        ).toEqual(6.54);
    })

    it('should also make random change totalling 6.54', () => {
        let change = makeChangeWithRandomDenominations(6.54);
        expect(
            (change.dollars * 1.0 + change.quarters * 0.25 + change.dimes * 0.1 + change.nickels * 0.05 + change.pennies * 0.01).toFixed(2)
        ).toEqual(6.54);
    })

    it('should make random change totalling 10.37', () => {
        let change = makeChangeWithRandomDenominations(10.37);
        expect(
            (change.dollars * 1.0 + change.quarters * 0.25 + change.dimes * 0.1 + change.nickels * 0.05 + change.pennies * 0.01).toFixed(2)
        ).toEqual(10.37);
    })

    it('should also make random change totalling 10.37', () => {
        let change = makeChangeWithRandomDenominations(10.37);
        expect(
            (change.dollars * 1.0 + change.quarters * 0.25 + change.dimes * 0.1 + change.nickels * 0.05 + change.pennies * 0.01).toFixed(2)
        ).toEqual(10.37);
    })

    it('should not handle negative amounts', () => {
        expect(
            makeChange(12.34, 5.00)
        ).toNotExist()
    })

    it('should only handle numbers', () => {
        expect(
            makeChange("abc", 5.00)
        ).toNotExist()
    })

    it('should randomize', () => {
        let change = makeChange(3.33, 10.00);
        expect(
            (change.dollars * 1.0 + change.quarters * 0.25 + change.dimes * 0.1 + change.nickels * 0.05 + change.pennies * 0.01).toFixed(2)
        ).toEqual(6.67);
    })

    it('should not randomize', () => {
        let change = makeChange(2.18, 10.00);
        expect(
            change
        ).toEqual({
            dollars: 7,
            quarters: 3,
            dimes: 0,
            nickels: 1,
            pennies: 2
        })
    })

    it('should handle empty bulk inputs', () => {
        let inputs = [];
        let outputs = makeBulkChange(inputs);
        expect(
            outputs
        ).toEqual([]);
    })

    it('should handle bulk inputs', () => {
        let inputs = [{purchaseAmount: 1.43, tenderedAmount: 5.00}, {
            purchaseAmount: 10,
            tenderedAmount: 4.5
        }, {purchaseAmount: 4.6, tenderedAmount: 10}];
        let outputs = makeBulkChange(inputs);
        expect(
            outputs
        ).toEqual([
            {
                dollars: 3,
                quarters: 2,
                dimes: 0,
                nickels: 1,
                pennies: 2
            },
            {
                dollars: 0,
                quarters: 0,
                dimes: 0,
                nickels: 0,
                pennies: 0
            },
            {
                dollars: 5,
                quarters: 1,
                dimes: 1,
                nickels: 1,
                pennies: 0
            }
        ]);
    })

})
