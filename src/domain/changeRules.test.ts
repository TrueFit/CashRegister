import { describe, expect, it } from 'vitest';
import {
  calculateChangeForLine,
  minimumChangeRule,
  processRegisterFile,
} from './changeRules';
import { parseMoneyToCents } from './currency';

describe('currency parsing', () => {
  it('converts whole and decimal money strings to cents', () => {
    expect(parseMoneyToCents('2')).toBe(200);
    expect(parseMoneyToCents('2.1')).toBe(210);
    expect(parseMoneyToCents('2.13')).toBe(213);
  });

  it('rejects invalid money strings', () => {
    expect(() => parseMoneyToCents('2.999')).toThrow('Invalid money amount');
    expect(() => parseMoneyToCents('abc')).toThrow('Invalid money amount');
  });
});

describe('cash register rules', () => {
  it('returns minimum physical change when the owed amount is not divisible by the random divisor', () => {
    const result = calculateChangeForLine('2.12,3.00', 1, {
      rules: [minimumChangeRule],
    });

    expect(result.output).toBe('3 quarters,1 dime,3 pennies');
    expect(result.strategy).toBe('minimum');
  });

  it('uses the random rule when owed cents are divisible by three', () => {
    const result = calculateChangeForLine('3.33,5.00', 1, {
      random: () => 0.99,
    });

    expect(result.strategy).toBe('random');
    expect(result.output).toBe('167 pennies');
  });

  it('uses all common US bills for large change amounts', () => {
    const result = calculateChangeForLine('2.12,100.00', 1, {
      rules: [minimumChangeRule],
    });

    expect(result.output).toBe(
      '1 fifty-dollar bill,2 twenty-dollar bills,1 five-dollar bill,1 two-dollar bill,3 quarters,1 dime,3 pennies',
    );
  });

  it('reports a shortfall when unavailable denominations cannot make exact change', () => {
    const result = calculateChangeForLine('2.12,3.00', 1, {
      denominations: [
        { singular: 'quarter', plural: 'quarters', cents: 25 },
        { singular: 'dime', plural: 'dimes', cents: 10 },
      ],
      rules: [minimumChangeRule],
    });

    expect(result.output).toBe('3 quarters,1 dime');
    expect(result.returnedChangeCents).toBe(85);
    expect(result.changeShortfallCents).toBe(3);
  });

  it('does not loop forever when random change cannot be completed exactly', () => {
    const result = calculateChangeForLine('3.33,5.00', 1, {
      denominations: [{ singular: 'quarter', plural: 'quarters', cents: 25 }],
      random: () => 0,
    });

    expect(result.strategy).toBe('random');
    expect(result.returnedChangeCents).toBe(150);
    expect(result.changeShortfallCents).toBe(17);
  });

  it('processes multiple non-empty file lines', () => {
    const results = processRegisterFile('2.12,3.00\n\n1.97,2.00', {
      rules: [minimumChangeRule],
    });

    expect(results.map((result) => result.output)).toEqual([
      '3 quarters,1 dime,3 pennies',
      '3 pennies',
    ]);
  });

  it('rejects payments that do not cover the owed amount', () => {
    expect(() => calculateChangeForLine('5.00,3.00', 1)).toThrow(
      'Line 1: amount paid is less than amount owed',
    );
  });
});
