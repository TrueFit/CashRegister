const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_PATH = path.resolve(__dirname, '../config/default.json');

/**
 * Retrieves a configuration value from one or multiple configuration sources using a path or list of candidate paths.
 * Resolves properties via dot notation (e.g. 'plugins.MyPlugin.key') and checks candidate paths in sequence.
 * Returns the first valid value that satisfies the optional validator, or the specified fallback value.
 *
 * @param {object|Array<object>} sources - Configuration object or array of source objects in priority order
 * @param {string|Array<string|Array<string>>} paths - Dot-notated path string or array of candidate paths
 * @param {*} [defaultValue=undefined] - Fallback value if no valid value is found
 * @param {string|Function} [validator] - Expected type (e.g. 'number', 'string', 'object') or validation function (val) => boolean
 * @returns {*} Resolved configuration value or defaultValue
 */
function getConfigValue(sources, paths, defaultValue = undefined, validator = null) {
  const sourceList = Array.isArray(sources)
    ? sources
    : (sources && typeof sources === 'object' ? [sources] : []);

  const pathList = Array.isArray(paths) ? paths : [paths];

  const isValid = (val) => {
    if (val === undefined || val === null) return false;
    if (typeof validator === 'function') {
      return Boolean(validator(val));
    }
    if (typeof validator === 'string') {
      return typeof val === validator;
    }
    return true;
  };

  const resolvePath = (obj, p) => {
    if (!obj || typeof obj !== 'object') return undefined;
    const segments = Array.isArray(p)
      ? p
      : (typeof p === 'string' ? p.split('.').filter(Boolean) : []);

    let current = obj;
    for (const segment of segments) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = current[segment];
    }
    return current;
  };

  for (const source of sourceList) {
    if (!source || typeof source !== 'object') continue;
    for (const p of pathList) {
      if (p === undefined || p === null) continue;
      const val = resolvePath(source, p);
      if (isValid(val)) {
        return val;
      }
    }
  }

  return defaultValue;
}

/**
 * Loads and merges configuration from a specified file, environment variable, or default config.
 * @param {string|object} [customConfig] - File path or configuration object
 * @returns {object} Merged configuration object
 */
function loadConfig(customConfig) {
  let baseConfig = {};
  if (fs.existsSync(DEFAULT_CONFIG_PATH)) {
    try {
      baseConfig = JSON.parse(fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf8'));
    } catch (err) {
      console.warn(`Warning: Could not parse default config at ${DEFAULT_CONFIG_PATH}:`, err.message);
    }
  }

  let userConfig = {};
  const configPath = typeof customConfig === 'string'
    ? customConfig
    : (process.env.CONFIG_PATH || null);

  if (configPath && fs.existsSync(configPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (err) {
      throw new Error(`Failed to read config file at ${configPath}: ${err.message}`);
    }
  } else if (typeof customConfig === 'object' && customConfig !== null) {
    userConfig = customConfig;
  }

  const basePlugins = baseConfig.plugins || {};
  const userPlugins = userConfig.plugins || {};
  const mergedPlugins = {};

  const allPluginKeys = new Set([...Object.keys(basePlugins), ...Object.keys(userPlugins)]);
  for (const key of allPluginKeys) {
    if (typeof basePlugins[key] === 'object' && basePlugins[key] !== null && typeof userPlugins[key] === 'object' && userPlugins[key] !== null) {
      mergedPlugins[key] = {
        ...basePlugins[key],
        ...userPlugins[key]
      };
    } else if (userPlugins[key] !== undefined) {
      mergedPlugins[key] = userPlugins[key];
    } else {
      mergedPlugins[key] = basePlugins[key];
    }
  }

  const merged = {
    ...baseConfig,
    ...userConfig,
    plugins: mergedPlugins,
    currencies: {
      ...(baseConfig.currencies || {}),
      ...(userConfig.currencies || {})
    }
  };

  // Ensure defaults if missing using configuration helper
  merged.currency = getConfigValue([userConfig, baseConfig], 'currency', 'USD', 'string');
  merged.decimalSeparator = getConfigValue([userConfig, baseConfig], 'decimalSeparator', '.', 'string');
  merged.plugins = merged.plugins || {};
  if (!merged.plugins.RandomChangeWithDivisorPlugin) {
    merged.plugins.RandomChangeWithDivisorPlugin = {};
  }
  if (typeof merged.plugins.RandomChangeWithDivisorPlugin.randomDivisor !== 'number') {
    merged.plugins.RandomChangeWithDivisorPlugin.randomDivisor = getConfigValue(
      [userConfig, baseConfig],
      'plugins.RandomChangeWithDivisorPlugin.randomDivisor',
      3,
      'number'
    );
  }

  return merged;
}

module.exports = {
  loadConfig,
  getConfigValue,
  DEFAULT_CONFIG_PATH
};
