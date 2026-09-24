const { SpecialCasePlugin } = require('./SpecialCasePlugin');
const { loadConfig, getConfigValue } = require('../config');

/**
 * Plugin that implements the special-case exception for transactions where the owed amount
 * (in minimum currency units) is evenly divisible by a configurable divisor (default 3).
 * When triggered, the change denominations are calculated randomly while matching the exact total.
 */
class RandomChangeWithDivisorPlugin extends SpecialCasePlugin {
  /**
   * @param {object} [options]
   * @param {number} [options.randomDivisor] - Divisor to check against
   * @param {string} [options.name='RandomChangeWithDivisorPlugin'] - Plugin name
   * @param {number} [options.priority=100] - Priority
   * @param {object|string} [options.config] - Optional configuration override or path
   */
  constructor(options = {}) {
    const config = loadConfig(options.config || options);
    const pluginName = getConfigValue([options, config], 'name', 'RandomChangeWithDivisorPlugin', 'string');
    const priority = getConfigValue([options, config], 'priority', 100, 'number');

    super({
      name: pluginName,
      description: 'Calculates randomized change breakdown when the owed amount is evenly divisible by a divisor (default 3)',
      priority
    });

    this.divisor = getConfigValue(
      [
        options,
        config
      ],
      [
        'randomDivisor',
        `plugins.${pluginName}.randomDivisor`
      ],
      3,
      'number'
    );
  }

  /**
   * Checks if the owed amount in minimum units is evenly divisible by the configured divisor.
   * 
   * @param {object} context
   * @returns {boolean}
   */
  isApplicable(context) {
    if (!context || typeof context.owedCents !== 'number' || typeof context.changeCents !== 'number') {
      return false;
    }

    if (context.owedCents <= 0 || context.changeCents <= 0) {
      return false;
    }

    return Boolean(this.divisor > 0 && context.owedCents % this.divisor === 0);
  }

  /**
   * Calculates randomized change breakdown matching the exact change amount.
   * 
   * @param {object} context
   * @returns {{ changeCents: number, isRandom: boolean, pluginName: string, breakdown: Array<{ name: string, plural: string, count: number, value: number }> }}
   */
  calculate(context) {
    const { changeCents, denominations, rng = Math.random } = context;

    if (changeCents <= 0) {
      return {
        changeCents: 0,
        isRandom: true,
        pluginName: this.name,
        breakdown: []
      };
    }

    // Ensure denominations are in descending order
    const sortedDenoms = [...denominations].sort((a, b) => b.value - a.value);
    const breakdown = [];
    let remaining = changeCents;

    for (let i = 0; i < sortedDenoms.length; i++) {
      const denom = sortedDenoms[i];
      const isLast = i === sortedDenoms.length - 1;

      if (isLast) {
        // Last (smallest) denomination absorbs the exact remainder
        const count = Math.floor(remaining / denom.value);
        remaining -= count * denom.value;
        breakdown.push({
          name: denom.name,
          plural: denom.plural,
          value: denom.value,
          count
        });
      } else {
        const maxPossible = Math.floor(remaining / denom.value);
        if (maxPossible > 0) {
          const count = Math.floor(rng() * (maxPossible + 1));
          remaining -= count * denom.value;
          breakdown.push({
            name: denom.name,
            plural: denom.plural,
            value: denom.value,
            count
          });
        } else {
          breakdown.push({
            name: denom.name,
            plural: denom.plural,
            value: denom.value,
            count: 0
          });
        }
      }
    }

    return {
      changeCents,
      isRandom: true,
      pluginName: this.name,
      breakdown
    };
  }
}

module.exports = {
  RandomChangeWithDivisorPlugin
};
