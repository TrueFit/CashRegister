import { calculateChange, DEFAULT_CONFIG } from '../../core/changeCalculator';
import { USD } from '../../core/currency';

describe('calculateChange', () => {
  test('uses minimum strategy when owed NOT divisible by divisor', () => {
    const result = calculateChange(2.12, 3.00, DEFAULT_CONFIG, USD);

    expect(result.isRandom).toBe(false);
    expect(result.changeInCents).toBe(88);
    expect(result.denominations).toEqual({
      quarter: 3,
      dime: 1,
      penny: 3,
    });
  });

  test('uses random strategy when owed IS divisible by divisor', () => {
    const result = calculateChange(3.33, 5.00, DEFAULT_CONFIG, USD);

    // 3.33 = 333 cents, divisible by 3
    expect(result.isRandom).toBe(true);
    expect(result.changeInCents).toBe(167);

    // Validate math is correct (sum of denominations equals change)
    let total = 0;
    for (const [name, count] of Object.entries(result.denominations)) {
      const denom = USD.denominations.find(d => d.name === name);
      if (denom) {
        total += denom.valueInCents * count;
      }
    }
    expect(total).toBe(167);
  });

  test('respects custom divisor', () => {
    const customConfig = { randomDivisor: 2, randomEnabled: true };

    // 2.00 = 200 cents, divisible by 2
    const result = calculateChange(2.00, 3.00, customConfig, USD);

    expect(result.isRandom).toBe(true);
  });

  test('respects randomEnabled flag', () => {
    const disabledConfig = { randomDivisor: 3, randomEnabled: false };

    // Even though 3.33 is divisible by 3, random is disabled
    const result = calculateChange(3.33, 5.00, disabledConfig, USD);

    expect(result.isRandom).toBe(false);
  });

  test('throws error when paid < owed', () => {
    expect(() => {
      calculateChange(5.00, 3.00, DEFAULT_CONFIG, USD);
    }).toThrow('Insufficient payment');
  });

  test('handles zero change correctly', () => {
    const result = calculateChange(5.00, 5.00, DEFAULT_CONFIG, USD);

    expect(result.changeInCents).toBe(0);
    expect(result.denominations).toEqual({});
    expect(result.isRandom).toBe(false);
  });

  test('handles sample inputs from README', () => {
    // Line 1: 2.12 owed, 3.00 paid
    const result1 = calculateChange(2.12, 3.00, DEFAULT_CONFIG, USD);
    expect(result1.isRandom).toBe(false); // 212 not divisible by 3
    expect(result1.changeInCents).toBe(88);

    // Line 2: 1.97 owed, 2.00 paid
    const result2 = calculateChange(1.97, 2.00, DEFAULT_CONFIG, USD);
    expect(result2.isRandom).toBe(false); // 197 not divisible by 3
    expect(result2.changeInCents).toBe(3);

    // Line 3: 3.33 owed, 5.00 paid
    const result3 = calculateChange(3.33, 5.00, DEFAULT_CONFIG, USD);
    expect(result3.isRandom).toBe(true); // 333 divisible by 3
    expect(result3.changeInCents).toBe(167);
  });
});
