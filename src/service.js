const { loadConfig, getConfigValue } = require('./config');
const { detectNewline, parseInputLine } = require('./parser');
const { calculateChange } = require('./changeCalculator');
const { formatChange } = require('./formatter');

const DEFAULT_USD_CURRENCY = {
  name: 'US Dollar',
  multiplier: 100,
  denominations: [
    { name: 'dollar', plural: 'dollars', value: 100 },
    { name: 'quarter', plural: 'quarters', value: 25 },
    { name: 'dime', plural: 'dimes', value: 10 },
    { name: 'nickel', plural: 'nickels', value: 5 },
    { name: 'penny', plural: 'pennies', value: 1 }
  ]
};

/**
 * Processes an input string representing transactions and returns the formatted change output string.
 * Mimics the newline style of the input string in the output string.
 * 
 * @param {string} inputText - Raw input file content
 * @param {string|object} [configOptions] - File path or config object override
 * @param {Function} [rng=Math.random] - Optional random number generator (e.g. for testing)
 * @param {import('./plugins').PluginRegistry} [pluginRegistry] - Optional plugin registry for special case exceptions
 * @returns {string} Formatted output file content
 */
function processTransactions(inputText, configOptions, rng = Math.random, pluginRegistry) {
  if (typeof inputText !== 'string') {
    inputText = String(inputText || '');
  }

  const config = loadConfig(configOptions);
  const currencyCode = getConfigValue(config, 'currency', 'USD', 'string');
  const currencyDef = getConfigValue(config, `currencies.${currencyCode}`, DEFAULT_USD_CURRENCY, 'object');

  const decimalSeparator = getConfigValue(config, 'decimalSeparator', '.', 'string');
  const zeroChangeMessage = getConfigValue(config, 'zeroChangeMessage', '0 pennies', 'string');
  const multiplier = getConfigValue(currencyDef, 'multiplier', 100, 'number');
  const denominations = getConfigValue(currencyDef, 'denominations', DEFAULT_USD_CURRENCY.denominations);

  const newline = detectNewline(inputText);

  // Check if input had a trailing newline
  const endsWithNewline = inputText.endsWith('\r\n') || inputText.endsWith('\n') || inputText.endsWith('\r');

  // Split lines
  const rawLines = inputText.split(/\r\n|\r|\n/);

  // If the file ends with a trailing newline, split produces an extra empty element at the end
  const linesToProcess = (endsWithNewline && rawLines.length > 0 && rawLines[rawLines.length - 1] === '')
    ? rawLines.slice(0, -1)
    : rawLines;

  const outputLines = linesToProcess.map((line, index) => {
    if (!line.trim()) {
      return '';
    }

    try {
      const parsed = parseInputLine(line, decimalSeparator, multiplier);
      if (!parsed) {
        return '';
      }

      const { owedCents, paidCents } = parsed;
      const result = calculateChange(owedCents, paidCents, denominations, {
        config,
        rng,
        pluginRegistry
      }, rng, pluginRegistry);
      return formatChange(result.breakdown, zeroChangeMessage);
    } catch (err) {
      return `Error processing line ${index + 1}: ${err.message}`;
    }
  });

  let outputText = outputLines.join(newline);
  if (endsWithNewline) {
    outputText += newline;
  }

  return outputText;
}

module.exports = {
  processTransactions
};
