// Core type definitions

export interface Denomination {
  name: string;
  pluralName: string;
  valueInCents: number;
  type: 'bill' | 'coin';
}

export interface CurrencySystem {
  code: string;
  symbol: string;
  denominations: Denomination[];
}

export interface CalculatorConfig {
  randomDivisor: number; // If change % divisor === 0, use random denominations
  randomEnabled: boolean;
}

export interface ChangeResult {
  owed: number;
  paid: number;
  changeInCents: number;
  denominations: Record<string, number>;
  isRandom: boolean;
}

export interface InputLine {
  owed: number;
  paid: number;
}
