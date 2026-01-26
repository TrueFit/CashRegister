import { calculateRandomChange, validateChange } from '../../core/randomChangeStrategy';
import { USD } from '../../core/currency';

describe('calculateRandomChange', () => {
  test('returns mathematically correct change', () => {
    const result = calculateRandomChange(167, USD);

    // Validate the sum equals expected amount
    expect(validateChange(result, 167, USD)).toBe(true);
  });

  test('produces variety in outputs', () => {
    const results = [];
    const changeAmount = 167;

    // Run multiple times
    for (let i = 0; i < 5; i++) {
      results.push(calculateRandomChange(changeAmount, USD));
    }

    // Check that all are valid
    results.forEach(result => {
      expect(validateChange(result, changeAmount, USD)).toBe(true);
    });

    // Check for some variety (at least one difference in any denomination)
    const uniqueResults = new Set(results.map(r => JSON.stringify(r)));
    // With randomization, we should get at least 2 different results out of 5
    expect(uniqueResults.size).toBeGreaterThan(1);
  });

  test('handles small amounts', () => {
    const result = calculateRandomChange(3, USD);

    expect(validateChange(result, 3, USD)).toBe(true);
  });

  test('never returns invalid denominations', () => {
    const result = calculateRandomChange(167, USD);

    // All keys should be valid denomination names
    Object.keys(result).forEach(key => {
      const denomination = USD.denominations.find(d => d.name === key);
      expect(denomination).toBeDefined();
    });
  });
});

describe('validateChange', () => {
  test('validates correct change', () => {
    const denominations = {
      quarter: 3,
      dime: 1,
      penny: 3,
    };

    expect(validateChange(denominations, 88, USD)).toBe(true);
  });

  test('rejects incorrect change', () => {
    const denominations = {
      quarter: 3,
      dime: 1,
      penny: 2, // Should be 3
    };

    expect(validateChange(denominations, 88, USD)).toBe(false);
  });

  test('rejects invalid denomination names', () => {
    const denominations = {
      invalid: 1,
    };

    expect(validateChange(denominations, 1, USD)).toBe(false);
  });
});
