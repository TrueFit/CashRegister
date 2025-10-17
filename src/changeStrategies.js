/**
 * Change Calculation Strategies Module
 *
 * Implements different strategies for calculating change:
 * - Minimum: Uses greedy algorithm to minimize number of denominations
 * - Random: Generates random valid combinations of denominations
 */

/**
 * Calculate change using minimum denominations (greedy algorithm)
 * @param {number} changeCents - Change amount in cents
 * @param {Array} denominations - Array of denomination objects (sorted descending)
 * @returns {Object} Map of denomination values to counts
 */
export function calculateMinimumChange(changeCents, denominations) {
  const changeMap = {};
  let remaining = changeCents;

  for (const denomination of denominations) {
    const count = Math.floor(remaining / denomination.value);
    if (count > 0) {
      changeMap[denomination.value] = count;
      remaining -= count * denomination.value;
    }
  }

  // Verify we calculated correctly
  if (remaining !== 0) {
    throw new Error(`Unable to make exact change for ${changeCents} cents`);
  }

  return changeMap;
}

/**
 * Calculate change using random denominations
 * This generates a valid but not necessarily optimal distribution
 * @param {number} changeCents - Change amount in cents
 * @param {Array} denominations - Array of denomination objects (sorted descending)
 * @returns {Object} Map of denomination values to counts
 */
export function calculateRandomChange(changeCents, denominations) {
  const changeMap = {};
  let remaining = changeCents;

  // Clone denominations array to avoid modifying original
  const availableDenoms = [...denominations];

  // Keep trying until we make exact change
  while (remaining > 0 && availableDenoms.length > 0) {
    // Pick a random denomination
    const randomIndex = Math.floor(Math.random() * availableDenoms.length);
    const denomination = availableDenoms[randomIndex];

    if (denomination.value <= remaining) {
      // Use this denomination
      const maxCount = Math.floor(remaining / denomination.value);
      // Pick a random count between 1 and maxCount
      const count = Math.floor(Math.random() * maxCount) + 1;

      changeMap[denomination.value] = (changeMap[denomination.value] || 0) + count;
      remaining -= count * denomination.value;
    } else {
      // This denomination is too large, remove it from options
      availableDenoms.splice(randomIndex, 1);
    }

    // Fallback: if we're down to the smallest denomination, use it to complete
    if (availableDenoms.length === 1 && remaining > 0) {
      const smallestDenom = availableDenoms[0];
      if (remaining % smallestDenom.value === 0) {
        const count = remaining / smallestDenom.value;
        changeMap[smallestDenom.value] = (changeMap[smallestDenom.value] || 0) + count;
        remaining = 0;
      }
    }
  }

  // Verify we calculated correctly
  if (remaining !== 0) {
    throw new Error(`Unable to make exact change for ${changeCents} cents`);
  }

  return changeMap;
}

/**
 * Strategy factory - returns the appropriate strategy based on conditions
 * @param {number} changeCents - Change amount in cents
 * @param {Object} config - Configuration object with special rules
 * @returns {Function} The strategy function to use
 */
export function selectStrategy(changeCents, config = {}) {
  const { randomDivisor = 3, enableRandom = true } = config;

  // Check if special random case applies
  if (enableRandom && changeCents % randomDivisor === 0 && changeCents > 0) {
    return calculateRandomChange;
  }

  return calculateMinimumChange;
}

export default {
  calculateMinimumChange,
  calculateRandomChange,
  selectStrategy
};
