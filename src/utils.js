/**
 * Utility Functions Module
 *
 * Provides helper functions for decimal arithmetic and formatting
 */

/**
 * Convert dollars to cents to avoid floating-point precision issues
 * @param {number} dollars - Amount in dollars
 * @returns {number} Amount in cents
 */
export function dollarsToCents(dollars) {
  return Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 * @param {number} cents - Amount in cents
 * @returns {number} Amount in dollars
 */
export function centsToDollars(cents) {
  return cents / 100;
}

/**
 * Format change denominations as a comma-separated string
 * @param {Object} changeMap - Map of denomination values to counts
 * @param {Array} denominations - Array of denomination objects
 * @returns {string} Formatted change string (e.g., "1 dollar,2 quarters")
 */
export function formatChange(changeMap, denominations) {
  const parts = [];

  for (const denomination of denominations) {
    const count = changeMap[denomination.value];
    if (count && count > 0) {
      const name = count === 1 ? denomination.name : denomination.pluralName;
      parts.push(`${count} ${name}`);
    }
  }

  return parts.join(',');
}

/**
 * Parse a line from the input file
 * @param {string} line - Input line (e.g., "2.13,3.00")
 * @returns {Object} Parsed values {owed, paid}
 */
export function parseLine(line) {
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

  if (paid < owed) {
    throw new Error(`Paid amount (${paid}) is less than owed amount (${owed})`);
  }

  return { owed, paid };
}

/**
 * Check if a number is divisible by another number
 * @param {number} value - The value to check
 * @param {number} divisor - The divisor
 * @returns {boolean} True if divisible
 */
export function isDivisibleBy(value, divisor) {
  return value % divisor === 0;
}

export default {
  dollarsToCents,
  centsToDollars,
  formatChange,
  parseLine,
  isDivisibleBy
};
