import { Injectable } from '@nestjs/common';
import { DenominationConfig } from '../../config/currency.config';
import {
  ChangeCalculationStrategy,
  DenominationResult,
} from './change-calculation.strategy';
import { GreedyChangeStrategy } from './greedy-change.strategy';

const MAX_ATTEMPTS = 1000;

@Injectable()
export class RandomChangeStrategy implements ChangeCalculationStrategy {
  private readonly greedy = new GreedyChangeStrategy();

  calculate(
    changeInCents: number,
    denominations: DenominationConfig[],
  ): DenominationResult[] {
    // Sort descending so we can filter usable denominations easily
    const sorted = [...denominations].sort(
      (a, b) => b.valueInCents - a.valueInCents,
    );

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const result = this.tryRandomDistribution(changeInCents, sorted);
      if (result !== null) {
        return result;
      }
    }

    // Fallback to greedy after exhausting attempts
    return this.greedy.calculate(changeInCents, denominations);
  }

  private tryRandomDistribution(
    changeInCents: number,
    sortedDenominations: DenominationConfig[],
  ): DenominationResult[] | null {
    const counts = new Map<number, number>();
    let remaining = changeInCents;

    while (remaining > 0) {
      const usable = sortedDenominations.filter(
        (d) => d.valueInCents <= remaining,
      );

      if (usable.length === 0) {
        return null;
      }

      // Pick a random denomination from usable ones
      const denom = usable[Math.floor(Math.random() * usable.length)];

      // Assign a random count between 1 and max that fits
      const maxCount = Math.floor(remaining / denom.valueInCents);
      const count = Math.floor(Math.random() * maxCount) + 1;

      counts.set(
        denom.valueInCents,
        (counts.get(denom.valueInCents) ?? 0) + count,
      );
      remaining -= count * denom.valueInCents;
    }

    // Map back to DenominationResult array
    const results: DenominationResult[] = [];
    for (const [valueInCents, count] of counts.entries()) {
      const denom = sortedDenominations.find(
        (d) => d.valueInCents === valueInCents,
      );
      if (denom) {
        results.push({ denomination: denom, count });
      }
    }

    // Sort by denomination value descending for consistent output
    results.sort((a, b) => b.denomination.valueInCents - a.denomination.valueInCents);

    return results;
  }
}
