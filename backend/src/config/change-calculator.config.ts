export interface ChangeCalculatorConfig {
  divisor: number;
}

export const CHANGE_CALCULATOR_CONFIG = 'CHANGE_CALCULATOR_CONFIG';

export const DEFAULT_CHANGE_CALCULATOR_CONFIG: ChangeCalculatorConfig = {
  divisor: 3,
};
