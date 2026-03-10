import { ChangeCalculatorConfig } from '../config/change-calculator.config';
import { DenominationConfig } from '../config/currency.config';
export interface ChangeResult {
    change: number;
    denominations: string;
    strategy: 'greedy' | 'random';
}
export declare class ChangeCalculatorService {
    private readonly denominations;
    private readonly config;
    private readonly greedy;
    private readonly random;
    constructor(denominations: DenominationConfig[], config: ChangeCalculatorConfig);
    calculate(amountOwed: number, amountPaid: number): ChangeResult;
    private formatDenominations;
}
