/**
 * Unit tests for utils module
 */

import {
  dollarsToCents,
  centsToDollars,
  formatChange,
  parseLine,
  isDivisibleBy
} from '../src/utils.js';

import { USD_DENOMINATIONS } from '../src/currencyConfig.js';

describe('Utils Module', () => {
  describe('dollarsToCents', () => {
    test('converts whole dollars correctly', () => {
      expect(dollarsToCents(1.00)).toBe(100);
      expect(dollarsToCents(5.00)).toBe(500);
    });

    test('converts decimal dollars correctly', () => {
      expect(dollarsToCents(2.13)).toBe(213);
      expect(dollarsToCents(0.88)).toBe(88);
      expect(dollarsToCents(1.67)).toBe(167);
    });

    test('handles zero', () => {
      expect(dollarsToCents(0)).toBe(0);
    });

    test('rounds to nearest cent', () => {
      // Note: JavaScript's Math.round handles 0.5 cases using "round half up" strategy
      // 1.005 * 100 = 100.49999999999999 due to floating-point precision, rounds to 100
      expect(dollarsToCents(1.006)).toBe(101);
      expect(dollarsToCents(1.004)).toBe(100);
    });
  });

  describe('centsToDollars', () => {
    test('converts cents to dollars correctly', () => {
      expect(centsToDollars(100)).toBe(1.00);
      expect(centsToDollars(213)).toBe(2.13);
      expect(centsToDollars(88)).toBe(0.88);
    });

    test('handles zero', () => {
      expect(centsToDollars(0)).toBe(0);
    });
  });

  describe('formatChange', () => {
    test('formats single denomination correctly', () => {
      const changeMap = { 1: 3 };
      expect(formatChange(changeMap, USD_DENOMINATIONS)).toBe('3 pennies');
    });

    test('formats multiple denominations correctly', () => {
      const changeMap = { 25: 3, 10: 1, 1: 3 };
      expect(formatChange(changeMap, USD_DENOMINATIONS)).toBe('3 quarters,1 dime,3 pennies');
    });

    test('uses singular form for count of 1', () => {
      const changeMap = { 100: 1, 25: 1 };
      expect(formatChange(changeMap, USD_DENOMINATIONS)).toBe('1 dollar,1 quarter');
    });

    test('uses plural form for count > 1', () => {
      const changeMap = { 100: 2, 5: 3 };
      expect(formatChange(changeMap, USD_DENOMINATIONS)).toBe('2 dollars,3 nickels');
    });

    test('ignores zero counts', () => {
      const changeMap = { 100: 1, 25: 0, 10: 2 };
      expect(formatChange(changeMap, USD_DENOMINATIONS)).toBe('1 dollar,2 dimes');
    });

    test('returns empty string for empty change map', () => {
      const changeMap = {};
      expect(formatChange(changeMap, USD_DENOMINATIONS)).toBe('');
    });
  });

  describe('parseLine', () => {
    test('parses valid line correctly', () => {
      const result = parseLine('2.13,3.00');
      expect(result).toEqual({ owed: 2.13, paid: 3.00 });
    });

    test('handles whitespace', () => {
      const result = parseLine('  1.97,2.00  ');
      expect(result).toEqual({ owed: 1.97, paid: 2.00 });
    });

    test('throws error for empty line', () => {
      expect(() => parseLine('')).toThrow('Empty line');
      expect(() => parseLine('   ')).toThrow('Empty line');
    });

    test('throws error for invalid format', () => {
      expect(() => parseLine('2.13')).toThrow('Invalid line format');
      expect(() => parseLine('2.13,3.00,4.00')).toThrow('Invalid line format');
    });

    test('throws error for invalid numbers', () => {
      expect(() => parseLine('abc,3.00')).toThrow('Invalid numbers');
      expect(() => parseLine('2.13,xyz')).toThrow('Invalid numbers');
    });

    test('throws error when paid is less than owed', () => {
      expect(() => parseLine('5.00,3.00')).toThrow('less than owed');
    });
  });

  describe('isDivisibleBy', () => {
    test('returns true for divisible numbers', () => {
      expect(isDivisibleBy(9, 3)).toBe(true);
      expect(isDivisibleBy(100, 10)).toBe(true);
      expect(isDivisibleBy(167, 1)).toBe(true);
    });

    test('returns false for non-divisible numbers', () => {
      expect(isDivisibleBy(10, 3)).toBe(false);
      expect(isDivisibleBy(88, 3)).toBe(false);
    });

    test('handles zero correctly', () => {
      expect(isDivisibleBy(0, 3)).toBe(true);
    });
  });
});
