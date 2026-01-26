// Main change calculator - decides which strategy to use based on config

import type { CalculatorConfig, ChangeResult, CurrencySystem } from './types';
import { calculateMinimumChange, toCents } from './minimumChangeStrategy';
import { calculateRandomChange } from './randomChangeStrategy';

export function calculateChange(
  owed: number,
  paid: number,
  config: CalculatorConfig,
  currency: CurrencySystem
): ChangeResult {
  if (paid < owed) {
    throw new Error(
      `Insufficient payment: paid $${paid.toFixed(2)} but owed $${owed.toFixed(2)}`
    );
  }

  const changeInCents = toCents(paid - owed);

  if (changeInCents === 0) {
    return {
      owed,
      paid,
      changeInCents: 0,
      denominations: {},
      isRandom: false,
    };
  }

  // Use random strategy if change is divisible by configured divisor
  const shouldUseRandom =
    config.randomEnabled && changeInCents % config.randomDivisor === 0;

  const denominations = shouldUseRandom
    ? calculateRandomChange(changeInCents, currency)
    : calculateMinimumChange(changeInCents, currency);

  return {
    owed,
    paid,
    changeInCents,
    denominations,
    isRandom: shouldUseRandom,
  };
}

export const DEFAULT_CONFIG: CalculatorConfig = {
  randomDivisor: 3,
  randomEnabled: true,
};
