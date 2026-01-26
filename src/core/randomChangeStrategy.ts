// Random change generation with constrained randomization
// Tries multiple random combinations, falls back to minimum if needed

import type { CurrencySystem } from './types';
import { calculateMinimumChange } from './minimumChangeStrategy';

const MAX_ATTEMPTS = 100;

export function calculateRandomChange(
  changeInCents: number,
  currency: CurrencySystem
): Record<string, number> {
  // Try to generate random valid combinations
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const result = tryRandomChange(changeInCents, currency);
    if (result) {
      return result;
    }
  }

  // Fall back to minimum change if randomization fails
  console.warn(
    `Random change generation failed after ${MAX_ATTEMPTS} attempts, falling back to minimum change`
  );
  return calculateMinimumChange(changeInCents, currency);
}

function tryRandomChange(
  changeInCents: number,
  currency: CurrencySystem
): Record<string, number> | null {
  const result: Record<string, number> = {};
  let remaining = changeInCents;

  // Shuffle denominations for randomness
  const shuffledDenoms = [...currency.denominations].sort(
    () => Math.random() - 0.5
  );

  for (const denomination of shuffledDenoms) {
    const maxCount = Math.floor(remaining / denomination.valueInCents);

    if (maxCount > 0) {
      // Randomly decide how many of this denomination to use (0 to maxCount)
      // Bias towards using some (not always 0)
      const count = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * (maxCount + 1));

      if (count > 0) {
        result[denomination.name] = count;
        remaining -= count * denomination.valueInCents;
      }
    }
  }

  // Check if we have exact change
  if (remaining === 0 && Object.keys(result).length > 0) {
    return result;
  }

  return null;
}

export function validateChange(
  denominations: Record<string, number>,
  expectedCents: number,
  currency: CurrencySystem
): boolean {
  let total = 0;

  for (const [name, count] of Object.entries(denominations)) {
    const denomination = currency.denominations.find((d) => d.name === name);
    if (!denomination) {
      return false;
    }
    total += denomination.valueInCents * count;
  }

  return total === expectedCents;
}
