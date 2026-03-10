import { GreedyChangeStrategy } from './greedy-change.strategy';
import { USD_DENOMINATIONS } from '../../config/currency.config';

describe('GreedyChangeStrategy', () => {
  let strategy: GreedyChangeStrategy;

  beforeEach(() => {
    strategy = new GreedyChangeStrategy();
  });

  it('should return no results for zero change', () => {
    const results = strategy.calculate(0, USD_DENOMINATIONS);
    expect(results).toEqual([]);
  });

  it('should return 1 dollar for 100 cents', () => {
    const results = strategy.calculate(100, USD_DENOMINATIONS);
    expect(results).toHaveLength(1);
    expect(results[0].denomination.valueInCents).toBe(100);
    expect(results[0].count).toBe(1);
  });

  it('should return 1 quarter and 1 dime and 1 nickel for 40 cents', () => {
    const results = strategy.calculate(40, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(40);
  });

  it('should use minimum number of denominations (greedy)', () => {
    // 75 cents = 3 quarters (greedy), not 75 pennies
    const results = strategy.calculate(75, USD_DENOMINATIONS);
    const quarters = results.find((r) => r.denomination.valueInCents === 25);
    expect(quarters).toBeDefined();
    expect(quarters!.count).toBe(3);
  });

  it('should handle large amounts correctly', () => {
    // $137.41 = 13741 cents
    const results = strategy.calculate(13741, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(13741);
  });

  it('should return denominations sorted by value descending', () => {
    const results = strategy.calculate(136, USD_DENOMINATIONS);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].denomination.valueInCents).toBeGreaterThanOrEqual(
        results[i].denomination.valueInCents,
      );
    }
  });

  it('should handle 1 cent correctly', () => {
    const results = strategy.calculate(1, USD_DENOMINATIONS);
    expect(results).toHaveLength(1);
    expect(results[0].denomination.valueInCents).toBe(1);
    expect(results[0].count).toBe(1);
  });

  it('should handle amounts that need multiple of same denomination', () => {
    // 50 cents = 2 quarters
    const results = strategy.calculate(50, USD_DENOMINATIONS);
    const quarters = results.find((r) => r.denomination.valueInCents === 25);
    expect(quarters).toBeDefined();
    expect(quarters!.count).toBe(2);
  });
});
