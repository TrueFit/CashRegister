// Format denomination output strings

import type { CurrencySystem } from '../core/types';

// Convert denominations map to string like "3 quarters,1 dime,3 pennies"
export function formatChange(
  denominations: Record<string, number>,
  currency: CurrencySystem
): string {
  const parts: string[] = [];

  // Iterate in denomination order (largest to smallest)
  for (const denom of currency.denominations) {
    const count = denominations[denom.name];
    if (count && count > 0) {
      const name = count === 1 ? denom.name : denom.pluralName;
      parts.push(`${count} ${name}`);
    }
  }

  return parts.join(',');
}

// Format dollar amount for display
export function formatDollar(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
