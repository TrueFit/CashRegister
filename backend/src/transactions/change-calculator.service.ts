import { Inject, Injectable } from '@nestjs/common';
import {
  CHANGE_CALCULATOR_CONFIG,
  ChangeCalculatorConfig,
} from '../config/change-calculator.config';
import {
  DENOMINATIONS_TOKEN,
  DenominationConfig,
} from '../config/currency.config';
import { DenominationResult } from './strategies/change-calculation.strategy';
import { GreedyChangeStrategy } from './strategies/greedy-change.strategy';
import { RandomChangeStrategy } from './strategies/random-change.strategy';

export interface ChangeResult {
  change: number;
  denominations: string;
  strategy: 'greedy' | 'random';
}

@Injectable()
export class ChangeCalculatorService {
  private readonly greedy = new GreedyChangeStrategy();
  private readonly random = new RandomChangeStrategy();

  constructor(
    @Inject(DENOMINATIONS_TOKEN)
    private readonly denominations: DenominationConfig[],
    @Inject(CHANGE_CALCULATOR_CONFIG)
    private readonly config: ChangeCalculatorConfig,
  ) {}

  calculate(amountOwed: number, amountPaid: number): ChangeResult {
    const changeInDollars = Math.round((amountPaid - amountOwed) * 100) / 100;
    const changeInCents = Math.round(changeInDollars * 100);

    const useRandom = changeInCents % this.config.divisor === 0;
    const strategyName: 'greedy' | 'random' = useRandom ? 'random' : 'greedy';

    const results: DenominationResult[] = useRandom
      ? this.random.calculate(changeInCents, this.denominations)
      : this.greedy.calculate(changeInCents, this.denominations);

    const denominationsString = this.formatDenominations(results);

    return {
      change: changeInDollars,
      denominations: denominationsString,
      strategy: strategyName,
    };
  }

  private formatDenominations(results: DenominationResult[]): string {
    if (results.length === 0) {
      return 'no change';
    }

    return results
      .map(({ denomination, count }) => {
        const label = count === 1 ? denomination.singular : denomination.plural;
        return `${count} ${label}`;
      })
      .join(', ');
  }
}
