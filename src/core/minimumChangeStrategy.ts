// Minimum change calculation using greedy algorithm
// Example: 88 cents = 3 quarters + 1 dime + 3 pennies

import type { CurrencySystem } from './types';

export function calculateMinimumChange(
  changeInCents: number,
  currency: CurrencySystem
): Record<string, number> {
  const result: Record<string, number> = {};
  let remaining = changeInCents;

  // Greedy approach: take largest denomination possible at each step
  for (const denomination of currency.denominations) {
    const count = Math.floor(remaining / denomination.valueInCents);

    if (count > 0) {
      result[denomination.name] = count;
      remaining = remaining % denomination.valueInCents;
    }
  }

  if (remaining !== 0) {
    throw new Error(`Unable to make exact change for ${changeInCents} cents`);
  }

  return result;
}

// Convert dollars to cents to avoid floating point issues (0.1 + 0.2 = 0.30000004)
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function toDollars(cents: number): number {
  return cents / 100;
}
