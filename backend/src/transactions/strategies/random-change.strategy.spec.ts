import { RandomChangeStrategy } from './random-change.strategy';
import { USD_DENOMINATIONS } from '../../config/currency.config';

describe('RandomChangeStrategy', () => {
  let strategy: RandomChangeStrategy;

  beforeEach(() => {
    strategy = new RandomChangeStrategy();
  });

  it('should return correct total for 100 cents', () => {
    const results = strategy.calculate(100, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(100);
  });

  it('should return correct total for 75 cents', () => {
    const results = strategy.calculate(75, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(75);
  });

  it('should return correct total for a large amount', () => {
    const results = strategy.calculate(5000, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(5000);
  });

  it('should return empty array for zero change', () => {
    const results = strategy.calculate(0, USD_DENOMINATIONS);
    // 0 change: no denominations needed
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(0);
  });

  it('should handle single-penny change', () => {
    const results = strategy.calculate(1, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(1);
  });

  it('should produce valid results across multiple runs (math correctness)', () => {
    for (let i = 0; i < 20; i++) {
      const changeInCents = Math.floor(Math.random() * 10000) + 1;
      const results = strategy.calculate(changeInCents, USD_DENOMINATIONS);
      const total = results.reduce(
        (sum, r) => sum + r.denomination.valueInCents * r.count,
        0,
      );
      expect(total).toBe(changeInCents);
    }
  });

  it('should not have duplicate denominations in results', () => {
    for (let i = 0; i < 10; i++) {
      const results = strategy.calculate(300, USD_DENOMINATIONS);
      const denomValues = results.map((r) => r.denomination.valueInCents);
      const uniqueValues = new Set(denomValues);
      // Each denomination should appear at most once (counts are accumulated)
      expect(denomValues.length).toBe(uniqueValues.size);
    }
  });

  it('should handle divisible-by-3 amounts correctly (the trigger condition)', () => {
    const results = strategy.calculate(300, USD_DENOMINATIONS);
    const total = results.reduce(
      (sum, r) => sum + r.denomination.valueInCents * r.count,
      0,
    );
    expect(total).toBe(300);
  });
});
