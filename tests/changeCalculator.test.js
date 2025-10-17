/**
 * Unit tests for change calculator module
 */

import { calculateChange, processLine } from '../src/changeCalculator.js';

describe('Change Calculator Module', () => {
  describe('calculateChange', () => {
    test('calculates change for 2.12 owed, 3.00 paid (88 cents)', () => {
      const result = calculateChange(2.12, 3.00, { enableRandom: false });
      expect(result).toBe('3 quarters,1 dime,3 pennies');
    });

    test('calculates change for 1.97 owed, 2.00 paid (3 cents)', () => {
      const result = calculateChange(1.97, 2.00, { enableRandom: false });
      expect(result).toBe('3 pennies');
    });

    test('calculates change for exact amount', () => {
      const result = calculateChange(5.00, 5.00, { enableRandom: false });
      expect(result).toBe('no change');
    });

    test('calculates change for 3.33 owed, 5.00 paid (167 cents - divisible by 3)', () => {
      const result = calculateChange(3.33, 5.00, { randomDivisor: 3, enableRandom: true });

      // Since it's random, we can't predict exact output, but we can validate format
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');

      // Verify that it contains valid denominations
      const validDenoms = ['dollar', 'quarter', 'dime', 'nickel', 'penny', 'pennies', 'quarters', 'dimes', 'nickels'];
      const containsValidDenom = validDenoms.some(denom => result.includes(denom));
      expect(containsValidDenom).toBe(true);
    });

    test('throws error when paid is less than owed', () => {
      expect(() => calculateChange(10.00, 5.00)).toThrow('less than owed');
    });

    test('handles decimal precision correctly', () => {
      const result = calculateChange(0.01, 0.02, { enableRandom: false });
      expect(result).toBe('1 penny');
    });

    test('calculates change with custom random divisor', () => {
      // 100 cents is divisible by 5
      const result = calculateChange(1.00, 2.00, { randomDivisor: 5, enableRandom: true });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('respects enableRandom flag', () => {
      // 99 cents is divisible by 3, but random is disabled
      const result = calculateChange(1.01, 2.00, { randomDivisor: 3, enableRandom: false });
      expect(result).toBe('3 quarters,2 dimes,4 pennies');
    });
  });

  describe('processLine', () => {
    test('processes valid line with minimum change', () => {
      const result = processLine('2.12,3.00', { enableRandom: false });
      expect(result).toBe('3 quarters,1 dime,3 pennies');
    });

    test('processes valid line with exact change', () => {
      const result = processLine('5.00,5.00', { enableRandom: false });
      expect(result).toBe('no change');
    });

    test('processes line with whitespace', () => {
      const result = processLine('  1.97,2.00  ', { enableRandom: false });
      expect(result).toBe('3 pennies');
    });

    test('throws error for empty line', () => {
      expect(() => processLine('')).toThrow('Empty line');
    });

    test('throws error for invalid format', () => {
      expect(() => processLine('2.12')).toThrow('Invalid line format');
    });

    test('throws error for invalid numbers', () => {
      expect(() => processLine('abc,3.00')).toThrow('Invalid numbers');
    });

    test('processes line with random change when divisible', () => {
      const result = processLine('3.33,5.00', { randomDivisor: 3, enableRandom: true });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('Integration tests', () => {
    test('processes all sample inputs correctly with minimum strategy', () => {
      const inputs = [
        { line: '2.12,3.00', expected: '3 quarters,1 dime,3 pennies' },
        { line: '1.97,2.00', expected: '3 pennies' }
      ];

      for (const input of inputs) {
        const result = processLine(input.line, { enableRandom: false });
        expect(result).toBe(input.expected);
      }
    });

    test('handles various change amounts correctly', () => {
      const testCases = [
        { owed: 0.01, paid: 1.00, expected: '3 quarters,2 dimes,4 pennies' },
        { owed: 0.75, paid: 1.00, expected: '1 quarter' },
        { owed: 0.50, paid: 1.00, expected: '2 quarters' },
        { owed: 0.00, paid: 0.50, expected: '2 quarters' }
      ];

      for (const testCase of testCases) {
        const result = calculateChange(testCase.owed, testCase.paid, { enableRandom: false });
        expect(result).toBe(testCase.expected);
      }
    });
  });
});
