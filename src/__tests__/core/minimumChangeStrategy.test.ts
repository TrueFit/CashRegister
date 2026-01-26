import { calculateMinimumChange, toCents } from '../../core/minimumChangeStrategy';
import { USD } from '../../core/currency';

describe('calculateMinimumChange', () => {
  test('calculates correct change for 88 cents', () => {
    const result = calculateMinimumChange(88, USD);

    expect(result).toEqual({
      quarter: 3,
      dime: 1,
      penny: 3,
    });
  });

  test('calculates correct change for 3 cents', () => {
    const result = calculateMinimumChange(3, USD);

    expect(result).toEqual({
      penny: 3,
    });
  });

  test('calculates correct change for 167 cents', () => {
    const result = calculateMinimumChange(167, USD);

    expect(result).toEqual({
      dollar: 1,
      quarter: 2,
      dime: 1,
      nickel: 1,
      penny: 2,
    });
  });

  test('handles zero change', () => {
    const result = calculateMinimumChange(0, USD);

    expect(result).toEqual({});
  });

  test('handles dollar amounts correctly', () => {
    const result = calculateMinimumChange(100, USD);

    expect(result).toEqual({
      dollar: 1,
    });
  });

  test('handles large amounts efficiently', () => {
    const result = calculateMinimumChange(999, USD);

    expect(result).toEqual({
      dollar: 9,
      quarter: 3,
      dime: 2,
      penny: 4,
    });
  });
});

describe('toCents', () => {
  test('converts dollars to cents correctly', () => {
    expect(toCents(0.88)).toBe(88);
    expect(toCents(1.67)).toBe(167);
    expect(toCents(3.33)).toBe(333);
  });

  test('handles floating point precision issues', () => {
    // 0.1 + 0.2 = 0.30000000000000004 in JavaScript
    expect(toCents(0.1 + 0.2)).toBe(30);
  });

  test('rounds correctly', () => {
    expect(toCents(1.01)).toBe(101);
    expect(toCents(1.00)).toBe(100);
    expect(toCents(2.50)).toBe(250);
  });
});
