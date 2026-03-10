import { DenominationConfig } from '../../config/currency.config';
import { ChangeCalculationStrategy, DenominationResult } from './change-calculation.strategy';
export declare class RandomChangeStrategy implements ChangeCalculationStrategy {
    private readonly greedy;
    calculate(changeInCents: number, denominations: DenominationConfig[]): DenominationResult[];
    private tryRandomDistribution;
}
