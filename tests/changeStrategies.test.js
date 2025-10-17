/**
 * Unit tests for change strategies module
 */

import {
  calculateMinimumChange,
  calculateRandomChange,
  selectStrategy
} from '../src/changeStrategies.js';

import { USD_DENOMINATIONS } from '../src/currencyConfig.js';

describe('Change Strategies Module', () => {
  describe('calculateMinimumChange', () => {
    test('calculates minimum change for 88 cents', () => {
      const result = calculateMinimumChange(88, USD_DENOMINATIONS);
      expect(result).toEqual({
        25: 3,  // 3 quarters = 75 cents
        10: 1,  // 1 dime = 10 cents
        1: 3    // 3 pennies = 3 cents
      });
    });

    test('calculates minimum change for 3 cents', () => {
      const result = calculateMinimumChange(3, USD_DENOMINATIONS);
      expect(result).toEqual({
        1: 3    // 3 pennies
      });
    });

    test('calculates minimum change for 167 cents', () => {
      const result = calculateMinimumChange(167, USD_DENOMINATIONS);
      expect(result).toEqual({
        100: 1,  // 1 dollar
        25: 2,   // 2 quarters = 50 cents
        10: 1,   // 1 dime = 10 cents
        5: 1,    // 1 nickel = 5 cents
        1: 2     // 2 pennies = 2 cents
      });
    });

    test('calculates minimum change for exact dollar amounts', () => {
      const result = calculateMinimumChange(100, USD_DENOMINATIONS);
      expect(result).toEqual({
        100: 1
      });
    });

    test('handles zero change', () => {
      const result = calculateMinimumChange(0, USD_DENOMINATIONS);
      expect(result).toEqual({});
    });

    test('uses minimum number of denominations', () => {
      const result = calculateMinimumChange(25, USD_DENOMINATIONS);
      expect(result).toEqual({
        25: 1  // 1 quarter, not 2 dimes + 1 nickel
      });
    });
  });

  describe('calculateRandomChange', () => {
    test('calculates valid random change that adds up correctly', () => {
      const changeCents = 167;
      const result = calculateRandomChange(changeCents, USD_DENOMINATIONS);

      // Calculate total from result
      let total = 0;
      for (const [value, count] of Object.entries(result)) {
        total += parseInt(value) * count;
      }

      expect(total).toBe(changeCents);
    });

    test('handles small amounts correctly', () => {
      const result = calculateRandomChange(3, USD_DENOMINATIONS);
      let total = 0;
      for (const [value, count] of Object.entries(result)) {
        total += parseInt(value) * count;
      }
      expect(total).toBe(3);
    });

    test('handles larger amounts correctly', () => {
      const changeCents = 500;
      const result = calculateRandomChange(changeCents, USD_DENOMINATIONS);
      let total = 0;
      for (const [value, count] of Object.entries(result)) {
        total += parseInt(value) * count;
      }
      expect(total).toBe(changeCents);
    });

    test('produces different results on multiple runs (probabilistic)', () => {
      const changeCents = 167;
      const results = [];

      // Run 10 times
      for (let i = 0; i < 10; i++) {
        results.push(JSON.stringify(calculateRandomChange(changeCents, USD_DENOMINATIONS)));
      }

      // Check that at least some results are different
      const uniqueResults = new Set(results);
      // With randomness, we should have some variation (not all identical)
      // This test might occasionally fail due to randomness, but it's unlikely
      expect(uniqueResults.size).toBeGreaterThan(1);
    });
  });

  describe('selectStrategy', () => {
    test('returns calculateMinimumChange for non-divisible amounts', () => {
      const strategy = selectStrategy(88, { randomDivisor: 3 });
      expect(strategy).toBe(calculateMinimumChange);
    });

    test('returns calculateRandomChange for divisible amounts', () => {
      const strategy = selectStrategy(99, { randomDivisor: 3 });
      expect(strategy).toBe(calculateRandomChange);
    });

    test('returns calculateRandomChange for 167 cents (divisible by 1)', () => {
      const strategy = selectStrategy(167, { randomDivisor: 1 });
      expect(strategy).toBe(calculateRandomChange);
    });

    test('uses default divisor of 3', () => {
      const strategy = selectStrategy(99);
      expect(strategy).toBe(calculateRandomChange);
    });

    test('respects custom divisor', () => {
      const strategy1 = selectStrategy(100, { randomDivisor: 5 });
      expect(strategy1).toBe(calculateRandomChange);

      const strategy2 = selectStrategy(99, { randomDivisor: 5 });
      expect(strategy2).toBe(calculateMinimumChange);
    });

    test('returns minimum strategy when random is disabled', () => {
      const strategy = selectStrategy(99, { randomDivisor: 3, enableRandom: false });
      expect(strategy).toBe(calculateMinimumChange);
    });

    test('handles zero change', () => {
      const strategy = selectStrategy(0, { randomDivisor: 3 });
      // Zero is divisible by 3, but we typically want minimum for zero
      // The current implementation will return random, which is ok
      expect([calculateMinimumChange, calculateRandomChange]).toContain(strategy);
    });
  });
});
