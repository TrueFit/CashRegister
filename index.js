const { processTransactions } = require('./src/service');
const { calculateChange } = require('./src/changeCalculator');
const { parseCurrencyAmount, parseInputLine, detectNewline } = require('./src/parser');
const { loadConfig, getConfigValue } = require('./src/config');
const { formatChange } = require('./src/formatter');
const { handler } = require('./src/lambda');
const { startServer } = require('./src/server');
const {
  SpecialCasePlugin,
  RandomChangeWithDivisorPlugin,
  PluginRegistry,
  createDefaultRegistry,
  defaultRegistry
} = require('./src/plugins');

module.exports = {
  processTransactions,
  calculateChange,
  parseCurrencyAmount,
  parseInputLine,
  detectNewline,
  loadConfig,
  getConfigValue,
  formatChange,
  handler,
  startServer,
  SpecialCasePlugin,
  RandomChangeWithDivisorPlugin,
  PluginRegistry,
  createDefaultRegistry,
  defaultRegistry
};
