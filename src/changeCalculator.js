/**
 * Change Calculator Module
 *
 * Main orchestrator for calculating change with configurable strategies
 */

import { getCurrencyConfig } from './currencyConfig.js';
import { selectStrategy } from './changeStrategies.js';
import { dollarsToCents, formatChange } from './utils.js';

/**
 * Calculate change for a transaction
 * @param {number} owed - Amount owed in dollars
 * @param {number} paid - Amount paid in dollars
 * @param {Object} options - Configuration options
 * @param {string} options.currency - Currency code (default: 'USD')
 * @param {number} options.randomDivisor - Divisor for random strategy (default: 3)
 * @param {boolean} options.enableRandom - Enable random strategy (default: true)
 * @returns {string} Formatted change string
 */
export function calculateChange(owed, paid, options = {}) {
  const {
    currency = 'USD',
    randomDivisor = 3,
    enableRandom = true
  } = options;

  // Get currency configuration
  const currencyConfig = getCurrencyConfig(currency);
  const { denominations } = currencyConfig;

  // Convert to cents to avoid floating-point issues
  const owedCents = dollarsToCents(owed);
  const paidCents = dollarsToCents(paid);
  const changeCents = paidCents - owedCents;

  // Validate
  if (changeCents < 0) {
    throw new Error('Paid amount is less than owed amount');
  }

  // Handle exact change
  if (changeCents === 0) {
    return 'no change';
  }

  // Select and execute strategy
  const strategyConfig = { randomDivisor, enableRandom };
  const strategy = selectStrategy(changeCents, strategyConfig);
  const changeMap = strategy(changeCents, denominations);

  // Format and return
  return formatChange(changeMap, denominations);
}

/**
 * Process a single line from input file
 * @param {string} line - Input line (e.g., "2.13,3.00")
 * @param {Object} options - Configuration options
 * @returns {string} Formatted change string
 */
export function processLine(line, options = {}) {
  // Parse is handled by parseLine in utils, but we'll do it here for simplicity
  const trimmed = line.trim();
  if (!trimmed) {
    throw new Error('Empty line');
  }

  const parts = trimmed.split(',');
  if (parts.length !== 2) {
    throw new Error(`Invalid line format: ${line}`);
  }

  const owed = parseFloat(parts[0]);
  const paid = parseFloat(parts[1]);

  if (isNaN(owed) || isNaN(paid)) {
    throw new Error(`Invalid numbers in line: ${line}`);
  }

  return calculateChange(owed, paid, options);
}

export default {
  calculateChange,
  processLine
};
