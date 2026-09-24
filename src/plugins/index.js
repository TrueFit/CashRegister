const { SpecialCasePlugin } = require('./SpecialCasePlugin');
const { RandomChangeWithDivisorPlugin } = require('./RandomChangeWithDivisorPlugin');
const { PluginRegistry, createDefaultRegistry, defaultRegistry } = require('./PluginRegistry');

module.exports = {
  SpecialCasePlugin,
  RandomChangeWithDivisorPlugin,
  PluginRegistry,
  createDefaultRegistry,
  defaultRegistry
};
