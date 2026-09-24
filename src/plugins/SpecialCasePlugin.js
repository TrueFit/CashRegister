/**
 * Interface / Base Class for Special Case Change Calculation Plugins.
 * 
 * Any custom business rule or special case exception (e.g. promotional rounding,
 * randomized change, lucky number bonuses, specific denomination preferences)
 * can implement this interface.
 */
class SpecialCasePlugin {
  /**
   * @param {object} [options]
   * @param {string} [options.name] - Unique identifier for the plugin
   * @param {string} [options.description] - Description of the special case rule
   * @param {number} [options.priority=100] - Execution priority (lower numbers execute first)
   */
  constructor(options = {}) {
    this.name = options.name || this.constructor.name;
    this.description = options.description || 'Special case change calculation plugin';
    this.priority = typeof options.priority === 'number' ? options.priority : 100;
  }

  /**
   * Evaluates whether this special case rule applies to the given transaction context.
   * 
   * @param {object} context
   * @param {number} context.owedCents - Amount owed in minimum currency units
   * @param {number} context.paidCents - Amount paid in minimum currency units
   * @param {number} context.changeCents - Total change required (paidCents - owedCents)
   * @param {Array<{ name: string, plural: string, value: number }>} context.denominations - Available currency denominations
   * @param {object} [context.config] - Active configuration options
   * @param {Function} [context.rng] - Random number generator function
   * @param {object} [context.options] - Optional runtime parameters
   * @returns {boolean} True if this plugin should handle the calculation
   */
  isApplicable(context) {
    throw new Error(`Plugin "${this.name}" must implement isApplicable(context)`);
  }

  /**
   * Calculates the change breakdown according to this special case rule.
   * 
   * @param {object} context - Same transaction context passed to isApplicable
   * @returns {{
   *   changeCents: number,
   *   breakdown: Array<{ name: string, plural: string, count: number, value: number }>,
   *   isRandom?: boolean,
   *   pluginName?: string,
   *   metadata?: object
   * }}
   */
  calculate(context) {
    throw new Error(`Plugin "${this.name}" must implement calculate(context)`);
  }

  /**
   * Validates that an object or instance conforms to the SpecialCasePlugin interface.
   * 
   * @param {any} plugin
   * @returns {boolean}
   */
  static validate(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      throw new TypeError('Plugin must be an object or class instance');
    }
    if (typeof plugin.name !== 'string' || !plugin.name.trim()) {
      throw new TypeError('Plugin must have a non-empty string "name" property');
    }
    if (typeof plugin.isApplicable !== 'function') {
      throw new TypeError(`Plugin "${plugin.name}" must implement "isApplicable(context)" function`);
    }
    if (typeof plugin.calculate !== 'function') {
      throw new TypeError(`Plugin "${plugin.name}" must implement "calculate(context)" function`);
    }
    return true;
  }
}

module.exports = {
  SpecialCasePlugin
};
