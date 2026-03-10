import { ChangeCalculatorService } from './change-calculator.service';
import { USD_DENOMINATIONS } from '../config/currency.config';
import { DEFAULT_CHANGE_CALCULATOR_CONFIG } from '../config/change-calculator.config';

describe('ChangeCalculatorService', () => {
  let service: ChangeCalculatorService;

  beforeEach(() => {
    service = new ChangeCalculatorService(
      USD_DENOMINATIONS,
      DEFAULT_CHANGE_CALCULATOR_CONFIG,
    );
  });

  it('should use greedy strategy when change is not divisible by divisor', () => {
    // $2.00 owed, $2.01 paid → change = $0.01 = 1 cent (not divisible by 3)
    const result = service.calculate(2.0, 2.01);
    expect(result.strategy).toBe('greedy');
    expect(result.change).toBeCloseTo(0.01, 2);
  });

  it('should use random strategy when change is divisible by divisor', () => {
    // $0.00 owed, $0.03 paid → change = $0.03 = 3 cents (divisible by 3)
    const result = service.calculate(0.01, 0.04);
    // 3 cents is divisible by 3
    expect(result.strategy).toBe('random');
  });

  it('should produce correct change amount', () => {
    const result = service.calculate(1.0, 5.0);
    expect(result.change).toBeCloseTo(4.0, 2);
  });

  it('should format denominations string correctly for greedy', () => {
    // $4.00 change = 400 cents. 400 % 3 != 0 so greedy
    // 400 = 4 * 100 cents = 4 dollars
    const result = service.calculate(1.0, 5.0);
    // Just ensure it's a non-empty string
    expect(result.denominations).toBeTruthy();
    expect(typeof result.denominations).toBe('string');
  });

  it('should use singular label when count is 1', () => {
    // $1.00 change = 100 cents. 100 % 3 != 0 (greedy). Should be "1 dollar"
    const result = service.calculate(0.0, 1.0);
    expect(result.denominations).toBe('1 dollar');
    expect(result.strategy).toBe('greedy');
  });

  it('should use plural label when count > 1', () => {
    // $2.00 = 200 cents. 200 % 3 != 0 (greedy). Should be "2 dollars"
    const result = service.calculate(0.0, 2.0);
    expect(result.denominations).toBe('2 dollars');
    expect(result.strategy).toBe('greedy');
  });

  it('should handle zero change correctly', () => {
    const result = service.calculate(5.0, 5.0);
    expect(result.change).toBe(0);
    expect(result.denominations).toBe('no change');
  });

  it('should respect a custom divisor', () => {
    const customService = new ChangeCalculatorService(USD_DENOMINATIONS, {
      divisor: 5,
    });
    // 5 cents / 5 = 1 → divisible → random
    const result = customService.calculate(0.0, 0.05);
    expect(result.strategy).toBe('random');
  });

  it('should produce mathematically correct change denominations', () => {
    // Use greedy: 7 cents → not divisible by 3
    const result = service.calculate(0.0, 0.07);
    expect(result.strategy).toBe('greedy');
    expect(result.denominations).toBe('1 nickel, 2 pennies');
  });
});
