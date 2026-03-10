import { Injectable } from '@nestjs/common';
import { DenominationConfig } from '../../config/currency.config';
import {
  ChangeCalculationStrategy,
  DenominationResult,
} from './change-calculation.strategy';

@Injectable()
export class GreedyChangeStrategy implements ChangeCalculationStrategy {
  calculate(
    changeInCents: number,
    denominations: DenominationConfig[],
  ): DenominationResult[] {
    const results: DenominationResult[] = [];
    let remaining = changeInCents;

    // Denominations must be sorted descending by value
    const sorted = [...denominations].sort(
      (a, b) => b.valueInCents - a.valueInCents,
    );

    for (const denom of sorted) {
      if (remaining <= 0) break;
      const count = Math.floor(remaining / denom.valueInCents);
      if (count > 0) {
        results.push({ denomination: denom, count });
        remaining -= count * denom.valueInCents;
      }
    }

    return results;
  }
}
