import { parseInputFile } from '../utils/fileParser';
import { calculateChange, DEFAULT_CONFIG } from '../core/changeCalculator';
import { formatChange } from '../utils/formatters';
import { USD } from '../core/currency';

describe('End-to-End Integration', () => {
  test('processes README sample input correctly', () => {
    const sampleInput = `2.12,3.00
1.97,2.00
3.33,5.00`;

    // Parse input
    const inputLines = parseInputFile(sampleInput);
    expect(inputLines).toHaveLength(3);

    // Calculate change for each line
    const results = inputLines.map(line =>
      calculateChange(line.owed, line.paid, DEFAULT_CONFIG, USD)
    );

    // Format output
    const formattedOutputs = results.map(result =>
      formatChange(result.denominations, USD)
    );

    // Verify Line 1: 2.12,3.00 -> 88 cents (not divisible by 3)
    expect(results[0].isRandom).toBe(false);
    expect(results[0].changeInCents).toBe(88);
    expect(formattedOutputs[0]).toBe('3 quarters,1 dime,3 pennies');

    // Verify Line 2: 1.97,2.00 -> 3 cents (197 not divisible by 3)
    expect(results[1].isRandom).toBe(false);
    expect(results[1].changeInCents).toBe(3);
    expect(formattedOutputs[1]).toBe('3 pennies');

    // Verify Line 3: 3.33,5.00 -> 167 cents (333 divisible by 3, random)
    expect(results[2].isRandom).toBe(true);
    expect(results[2].changeInCents).toBe(167);

    // Validate random output is mathematically correct
    let total = 0;
    for (const [name, count] of Object.entries(results[2].denominations)) {
      const denom = USD.denominations.find(d => d.name === name);
      if (denom) {
        total += denom.valueInCents * count;
      }
    }
    expect(total).toBe(167);
  });

  test('handles edge cases gracefully', () => {
    const edgeCases = `0.01,0.01
10.00,20.00
5.55,10.00`;

    const inputLines = parseInputFile(edgeCases);
    const results = inputLines.map(line =>
      calculateChange(line.owed, line.paid, DEFAULT_CONFIG, USD)
    );

    // Zero change
    expect(results[0].changeInCents).toBe(0);
    expect(results[0].denominations).toEqual({});

    // Large change
    expect(results[1].changeInCents).toBe(1000);

    // Regular change
    expect(results[2].changeInCents).toBe(445);
  });

  test('respects configuration changes', () => {
    const input = '2.00,3.00'; // 200 cents owed

    const inputLine = parseInputFile(input)[0];

    // With divisor 2 (200 divisible by 2)
    const result1 = calculateChange(
      inputLine.owed,
      inputLine.paid,
      { randomDivisor: 2, randomEnabled: true },
      USD
    );
    expect(result1.isRandom).toBe(true);

    // With divisor 3 (200 not divisible by 3)
    const result2 = calculateChange(
      inputLine.owed,
      inputLine.paid,
      { randomDivisor: 3, randomEnabled: true },
      USD
    );
    expect(result2.isRandom).toBe(false);

    // With random disabled
    const result3 = calculateChange(
      inputLine.owed,
      inputLine.paid,
      { randomDivisor: 2, randomEnabled: false },
      USD
    );
    expect(result3.isRandom).toBe(false);
  });
});
