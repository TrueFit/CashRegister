/**
 * Detects the newline style of a given text.
 * @param {string} text 
 * @returns {'\r\n'|'\n'|'\r'}
 */
function detectNewline(text) {
  if (typeof text !== 'string') return '\n';
  if (text.includes('\r\n')) return '\r\n';
  if (text.includes('\n')) return '\n';
  if (text.includes('\r')) return '\r';
  return '\n';
}

/**
 * Parses a decimal currency string into integer minimum units (e.g., cents) to prevent floating-point inaccuracies.
 * @param {string} rawValue - The currency amount string (e.g. "1.33" or "5")
 * @param {string} [decimalSeparator='.'] - The decimal character
 * @param {number} [multiplier=100] - Conversion multiplier (100 cents per dollar)
 * @returns {number} Amount in minimum currency units
 */
function parseCurrencyAmount(rawValue, decimalSeparator = '.', multiplier = 100) {
  if (typeof rawValue !== 'string') {
    rawValue = String(rawValue);
  }
  let clean = rawValue.trim();
  // Strip optional currency symbols like $ or € if present
  clean = clean.replace(/^[^\d+-]+/, '').trim();

  if (!clean) {
    throw new Error(`Invalid empty currency amount: "${rawValue}"`);
  }

  const isNegative = clean.startsWith('-');
  if (isNegative || clean.startsWith('+')) {
    clean = clean.substring(1).trim();
  }

  let integerPart = clean;
  let fractionalPart = '';

  const sepIndex = clean.indexOf(decimalSeparator);
  if (sepIndex !== -1) {
    integerPart = clean.slice(0, sepIndex);
    fractionalPart = clean.slice(sepIndex + decimalSeparator.length);
  }

  if (integerPart && !/^\d+$/.test(integerPart)) {
    throw new Error(`Invalid integer part in currency amount: "${rawValue}"`);
  }
  if (fractionalPart && !/^\d+$/.test(fractionalPart)) {
    throw new Error(`Invalid fractional part in currency amount: "${rawValue}"`);
  }

  const intVal = integerPart ? parseInt(integerPart, 10) : 0;
  
  // Calculate digits in multiplier (e.g. 100 has 2 decimal digits)
  const decimalPlaces = Math.round(Math.log10(multiplier));
  const normalizedFraction = (fractionalPart + '0'.repeat(decimalPlaces)).slice(0, decimalPlaces);
  const fracVal = parseInt(normalizedFraction || '0', 10);

  const total = intVal * multiplier + fracVal;
  return isNegative ? -total : total;
}

/**
 * Parses an input line containing two currency values (owed and paid).
 * @param {string} line - A single line from the input file
 * @param {string} [decimalSeparator='.'] - The decimal character
 * @param {number} [multiplier=100] - Cents multiplier
 * @returns {{ owedCents: number, paidCents: number, owedRaw: string, paidRaw: string } | null}
 */
function parseInputLine(line, decimalSeparator = '.', multiplier = 100) {
  if (!line || !line.trim()) {
    return null;
  }

  const trimmed = line.trim();
  let parts = [];

  if (decimalSeparator === ',') {
    // If decimal separator is comma, delimiter between owed and paid could be semicolon, tab, or space
    if (trimmed.includes(';')) {
      parts = trimmed.split(';').map(s => s.trim()).filter(Boolean);
    } else if (trimmed.includes('\t')) {
      parts = trimmed.split('\t').map(s => s.trim()).filter(Boolean);
    } else if (/\s{1,}/.test(trimmed)) {
      parts = trimmed.split(/\s+/).map(s => s.trim()).filter(Boolean);
    } else if (trimmed.includes(',')) {
      // Multiple commas: try to split intelligently
      const commaTokens = trimmed.split(',').map(s => s.trim());
      if (commaTokens.length === 2) {
        parts = commaTokens;
      } else if (commaTokens.length === 4) {
        parts = [`${commaTokens[0]},${commaTokens[1]}`, `${commaTokens[2]},${commaTokens[3]}`];
      }
    }
  } else {
    // Standard decimal separator (e.g. '.')
    if (trimmed.includes(',')) {
      parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
    } else if (trimmed.includes(';')) {
      parts = trimmed.split(';').map(s => s.trim()).filter(Boolean);
    } else if (trimmed.includes('\t')) {
      parts = trimmed.split('\t').map(s => s.trim()).filter(Boolean);
    } else {
      parts = trimmed.split(/\s+/).map(s => s.trim()).filter(Boolean);
    }
  }

  if (parts.length < 2) {
    throw new Error(`Line must contain two currency values (owed and paid): "${line}"`);
  }

  const owedRaw = parts[0];
  const paidRaw = parts[1];

  const owedCents = parseCurrencyAmount(owedRaw, decimalSeparator, multiplier);
  const paidCents = parseCurrencyAmount(paidRaw, decimalSeparator, multiplier);

  return {
    owedCents,
    paidCents,
    owedRaw,
    paidRaw
  };
}

module.exports = {
  detectNewline,
  parseCurrencyAmount,
  parseInputLine
};
