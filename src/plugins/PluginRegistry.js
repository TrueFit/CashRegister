const { SpecialCasePlugin } = require('./SpecialCasePlugin');

/**
 * Registry and lifecycle manager for change calculation special case plugins.
 */
class PluginRegistry {
  constructor() {
    /** @type {Map<string, SpecialCasePlugin>} */
    this.plugins = new Map();
  }

  /**
   * Registers a plugin instance.
   * 
   * @param {SpecialCasePlugin|object} plugin
   * @returns {PluginRegistry} this (for chaining)
   */
  register(plugin) {
    SpecialCasePlugin.validate(plugin);
    if (this.plugins.has(plugin.name)) {
      console.warn(`PluginRegistry: Overwriting existing plugin with name "${plugin.name}"`);
    }
    this.plugins.set(plugin.name, plugin);
    return this;
  }

  /**
   * Unregisters a plugin by name.
   * 
   * @param {string} name
   * @returns {boolean} True if removed, false if not found
   */
  unregister(name) {
    return this.plugins.delete(name);
  }

  /**
   * Checks if a plugin is registered.
   * 
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.plugins.has(name);
  }

  /**
   * Retrieves a plugin by name.
   * 
   * @param {string} name
   * @returns {SpecialCasePlugin|undefined}
   */
  get(name) {
    return this.plugins.get(name);
  }

  /**
   * Returns all registered plugins sorted by priority (ascending).
   * 
   * @returns {Array<SpecialCasePlugin>}
   */
  getAll() {
    return Array.from(this.plugins.values()).sort((a, b) => {
      const pA = typeof a.priority === 'number' ? a.priority : 100;
      const pB = typeof b.priority === 'number' ? b.priority : 100;
      return pA - pB;
    });
  }

  /**
   * Clears all registered plugins.
   */
  clear() {
    this.plugins.clear();
  }

  /**
   * Finds the first applicable plugin for the transaction context.
   * 
   * @param {object} context
   * @returns {SpecialCasePlugin|null}
   */
  findApplicable(context) {
    const plugins = this.getAll();
    for (const plugin of plugins) {
      try {
        if (plugin.isApplicable(context)) {
          return plugin;
        }
      } catch (err) {
        console.error(`Error in isApplicable for plugin "${plugin.name}":`, err.message);
      }
    }
    return null;
  }

  /**
   * Executes the first matching plugin calculation for the transaction context.
   * 
   * @param {object} context
   * @returns {object|null} Plugin calculation result or null if no plugin applies
   */
  execute(context) {
    const plugin = this.findApplicable(context);
    if (!plugin) {
      return null;
    }

    const result = plugin.calculate(context);
    if (result && typeof result === 'object' && !result.pluginName) {
      result.pluginName = plugin.name;
    }
    return result;
  }
}

/**
 * Creates and initializes a default PluginRegistry with standard built-in plugins.
 * 
 * @returns {PluginRegistry}
 */
function createDefaultRegistry() {
  const { RandomChangeWithDivisorPlugin } = require('./RandomChangeWithDivisorPlugin');
  const registry = new PluginRegistry();
  registry.register(new RandomChangeWithDivisorPlugin());
  return registry;
}

// Global default singleton registry
const defaultRegistry = createDefaultRegistry();

module.exports = {
  PluginRegistry,
  createDefaultRegistry,
  defaultRegistry
};
