export interface DenominationConfig {
    valueInCents: number;
    singular: string;
    plural: string;
}
export declare const DENOMINATIONS_TOKEN = "DENOMINATIONS_TOKEN";
export declare const USD_DENOMINATIONS: DenominationConfig[];
export declare const EUR_DENOMINATIONS: DenominationConfig[];
export declare const CURRENCY_DENOMINATIONS: Record<string, DenominationConfig[]>;
