import { DenominationConfig } from '../../config/currency.config';
export interface DenominationResult {
    denomination: DenominationConfig;
    count: number;
}
export interface ChangeCalculationStrategy {
    calculate(changeInCents: number, denominations: DenominationConfig[]): DenominationResult[];
}
