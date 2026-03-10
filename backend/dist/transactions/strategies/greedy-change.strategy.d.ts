import { DenominationConfig } from '../../config/currency.config';
import { ChangeCalculationStrategy, DenominationResult } from './change-calculation.strategy';
export declare class GreedyChangeStrategy implements ChangeCalculationStrategy {
    calculate(changeInCents: number, denominations: DenominationConfig[]): DenominationResult[];
}
