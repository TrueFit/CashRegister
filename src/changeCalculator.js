const { defaultRegistry, PluginRegistry } = require('./plugins');

/**
 * Calculates the change breakdown for a transaction.
 * Checks registered special case plugins (such as RandomChangeWithDivisorPlugin).
 * If no plugin handles the transaction, computes the optimal baseline minimum physical change.
 * 
 * @param {number} owedCents - Amount owed in minimum currency units
 * @param {number} paidCents - Amount paid in minimum currency units
 * @param {Array<{ name: string, plural: string, value: number }>} denominations - Currency denominations
 * @param {object|Function} [options={}] - Options object (e.g. { config, rng, pluginRegistry }) or rng function
 * @param {Function} [rng=Math.random] - Random number generator function
 * @param {PluginRegistry} [pluginRegistry] - Optional custom plugin registry
 * @returns {{ changeCents: number, isRandom: boolean, pluginName?: string, breakdown: Array<{ name: string, plural: string, count: number, value: number }> }}
 */
function calculateChange(owedCents, paidCents, denominations, options = {}, rng = Math.random, pluginRegistry) {
  if (paidCents < owedCents) {
    throw new Error(`Insufficient payment: Paid amount (${paidCents}) is less than owed amount (${owedCents}).`);
  }

  const changeCents = paidCents - owedCents;

  let effectiveRng = rng;
  let effectiveRegistry = pluginRegistry || defaultRegistry;
  let customOptions = {};

  if (typeof options === 'function') {
    effectiveRng = options;
  } else if (options && typeof options === 'object') {
    customOptions = options;
    if (typeof customOptions.rng === 'function') {
      effectiveRng = customOptions.rng;
    }
    if (customOptions.pluginRegistry) {
      effectiveRegistry = customOptions.pluginRegistry;
    } else if (Array.isArray(customOptions.plugins)) {
      effectiveRegistry = new PluginRegistry();
      for (const p of customOptions.plugins) {
        effectiveRegistry.register(p);
      }
    }
  }

  // Ensure denominations are in descending order
  const sortedDenoms = [...denominations].sort((a, b) => b.value - a.value);

  if (changeCents === 0) {
    return {
      changeCents: 0,
      isRandom: false,
      breakdown: []
    };
  }

  // Build context for special case plugins
  const context = {
    owedCents,
    paidCents,
    changeCents,
    denominations: sortedDenoms,
    config: customOptions.config || {},
    options: customOptions,
    rng: effectiveRng
  };

  // Check if any registered plugin handles this special case
  if (effectiveRegistry && typeof effectiveRegistry.execute === 'function') {
    const pluginResult = effectiveRegistry.execute(context);
    if (pluginResult && Array.isArray(pluginResult.breakdown)) {
      return {
        changeCents,
        isRandom: Boolean(pluginResult.isRandom),
        pluginName: pluginResult.pluginName,
        breakdown: pluginResult.breakdown,
        metadata: pluginResult.metadata
      };
    }
  }

  // Baseline minimum physical change calculation (greedy)
  const breakdown = [];
  let remaining = changeCents;

  for (const denom of sortedDenoms) {
    const count = Math.floor(remaining / denom.value);
    remaining %= denom.value;
    breakdown.push({
      name: denom.name,
      plural: denom.plural,
      value: denom.value,
      count
    });
  }

  return {
    changeCents,
    isRandom: false,
    breakdown
  };
}

module.exports = {
  calculateChange
};
