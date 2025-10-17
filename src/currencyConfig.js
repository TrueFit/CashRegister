/**
 * Currency Configuration Module
 *
 * Provides configurable currency denominations for different locales.
 * Supports extensibility for international currencies.
 */

/**
 * US Dollar denominations in cents (sorted descending for greedy algorithm)
 */
export const USD_DENOMINATIONS = [
  { value: 100, name: 'dollar', pluralName: 'dollars' },
  { value: 25, name: 'quarter', pluralName: 'quarters' },
  { value: 10, name: 'dime', pluralName: 'dimes' },
  { value: 5, name: 'nickel', pluralName: 'nickels' },
  { value: 1, name: 'penny', pluralName: 'pennies' }
];

/**
 * Euro denominations in cents (example for future extensibility)
 */
export const EUR_DENOMINATIONS = [
  { value: 20000, name: 'two hundred euro note', pluralName: 'two hundred euro notes' },
  { value: 10000, name: 'one hundred euro note', pluralName: 'one hundred euro notes' },
  { value: 5000, name: 'fifty euro note', pluralName: 'fifty euro notes' },
  { value: 2000, name: 'twenty euro note', pluralName: 'twenty euro notes' },
  { value: 1000, name: 'ten euro note', pluralName: 'ten euro notes' },
  { value: 500, name: 'five euro note', pluralName: 'five euro notes' },
  { value: 200, name: 'two euro coin', pluralName: 'two euro coins' },
  { value: 100, name: 'one euro coin', pluralName: 'one euro coins' },
  { value: 50, name: 'fifty cent coin', pluralName: 'fifty cent coins' },
  { value: 20, name: 'twenty cent coin', pluralName: 'twenty cent coins' },
  { value: 10, name: 'ten cent coin', pluralName: 'ten cent coins' },
  { value: 5, name: 'five cent coin', pluralName: 'five cent coins' },
  { value: 2, name: 'two cent coin', pluralName: 'two cent coins' },
  { value: 1, name: 'one cent coin', pluralName: 'one cent coins' }
];

/**
 * Currency configuration registry
 */
export const CURRENCY_CONFIGS = {
  USD: {
    denominations: USD_DENOMINATIONS,
    symbol: '$',
    decimalPlaces: 2
  },
  EUR: {
    denominations: EUR_DENOMINATIONS,
    symbol: '€',
    decimalPlaces: 2
  }
};

/**
 * Get currency configuration by code
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns {Object} Currency configuration
 */
export function getCurrencyConfig(currencyCode = 'USD') {
  const config = CURRENCY_CONFIGS[currencyCode];
  if (!config) {
    throw new Error(`Unsupported currency: ${currencyCode}`);
  }
  return config;
}

export default {
  USD_DENOMINATIONS,
  EUR_DENOMINATIONS,
  CURRENCY_CONFIGS,
  getCurrencyConfig
};
