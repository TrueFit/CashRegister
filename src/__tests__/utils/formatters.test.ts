import { formatChange } from '../../utils/formatters';
import { USD } from '../../core/currency';

describe('formatChange', () => {
  test('formats single denomination correctly', () => {
    const denominations = { penny: 3 };
    const result = formatChange(denominations, USD);

    expect(result).toBe('3 pennies');
  });

  test('formats multiple denominations correctly', () => {
    const denominations = {
      quarter: 3,
      dime: 1,
      penny: 3,
    };
    const result = formatChange(denominations, USD);

    expect(result).toBe('3 quarters,1 dime,3 pennies');
  });

  test('handles singular forms correctly', () => {
    const denominations = {
      dollar: 1,
      quarter: 1,
      penny: 1,
    };
    const result = formatChange(denominations, USD);

    expect(result).toBe('1 dollar,1 quarter,1 penny');
  });

  test('maintains denomination order (largest to smallest)', () => {
    const denominations = {
      penny: 2,
      dollar: 1,
      quarter: 2,
      nickel: 1,
      dime: 1,
    };
    const result = formatChange(denominations, USD);

    expect(result).toBe('1 dollar,2 quarters,1 dime,1 nickel,2 pennies');
  });

  test('handles empty denominations', () => {
    const denominations = {};
    const result = formatChange(denominations, USD);

    expect(result).toBe('');
  });

  test('skips zero counts', () => {
    const denominations = {
      quarter: 3,
      dime: 0,
      penny: 3,
    };
    const result = formatChange(denominations, USD);

    expect(result).toBe('3 quarters,3 pennies');
  });

  test('matches README expected output format', () => {
    // Sample output from README: "3 quarters,1 dime,3 pennies"
    const denominations = {
      quarter: 3,
      dime: 1,
      penny: 3,
    };
    const result = formatChange(denominations, USD);

    expect(result).toBe('3 quarters,1 dime,3 pennies');
  });
});
