#!/usr/bin/env node
/**
 * Cash Register — Change Calculator
 * ----------------------------------
 * Reads a text file where each line is: amountOwed,amountPaid
 *   e.g.  2.13,3.00
 *
 * Writes a text file with one line of change per input line, e.g.:
 *   3 quarters,1 dime,2 pennies
 *
 * Rule:
 *   - Normally, change is made using the MINIMUM number of coins/bills.
 *   - If the amount owed is evenly divisible by 3, the change is instead
 *     made up of RANDOMLY chosen denominations (still summing to the
 *     correct amount, just not necessarily minimal).
 *
 * Usage:
 *   node cashRegister.js input.txt output.txt
 */

const fs = require("fs");
const path = require("path");

// If the amount owed (in cents) is evenly divisible by this number,
// change is generated randomly instead of using the minimum coin count.
const RANDOM_CHANGE_DIVISOR = 3;

// Denominations, ordered largest to smallest, values in cents.
// Each has a singular and plural display name.
const DENOMINATIONS = [
  { value: 2000, singular: "twenty-dollar bill", plural: "twenty-dollar bills" },
  { value: 1000, singular: "ten-dollar bill", plural: "ten-dollar bills" },
  { value: 500, singular: "five-dollar bill", plural: "five-dollar bills" },
  { value: 100, singular: "dollar", plural: "dollars" },
  { value: 25, singular: "quarter", plural: "quarters" },
  { value: 10, singular: "dime", plural: "dimes" },
  { value: 5, singular: "nickel", plural: "nickels" },
  { value: 1, singular: "penny", plural: "pennies" },
];

/**
 * Convert a dollar-amount string (e.g. "2.13") to an integer number of
 * cents, avoiding floating point rounding issues.
 */
function toCents(amountStr) {
  const n = Number(amountStr);
  if (Number.isNaN(n)) {
    throw new Error(`Invalid amount: "${amountStr}"`);
  }
  return Math.round(n * 100);
}

/**
 * Greedy minimum-coin change calculation.
 * Returns a Map<denomination, count>.
 */
function minimumChange(amountCents) {
  const result = new Map();
  let remaining = amountCents;

  for (const denom of DENOMINATIONS) {
    const count = Math.floor(remaining / denom.value);
    if (count > 0) {
      result.set(denom, count);
      remaining -= count * denom.value;
    }
  }
  return result;
}

/**
 * Randomized (non-minimal) change calculation.
 * Shuffles the denomination order, takes a random count of each
 * (bounded by what's still needed), and tops up any leftover with
 * pennies so the total always comes out exactly right.
 * Returns a Map<denomination, count>.
 */
function randomChange(amountCents) {
  const result = new Map();
  let remaining = amountCents;

  // Shuffle a copy of the denominations (Fisher-Yates)
  const shuffled = [...DENOMINATIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  for (const denom of shuffled) {
    if (remaining <= 0) break;
    const maxCount = Math.floor(remaining / denom.value);
    if (maxCount <= 0) continue;
    const count = Math.floor(Math.random() * (maxCount + 1));
    if (count > 0) {
      result.set(denom, (result.get(denom) || 0) + count);
      remaining -= count * denom.value;
    }
  }

  // Top up any leftover cents with pennies so the total is always exact.
  if (remaining > 0) {
    const penny = DENOMINATIONS[DENOMINATIONS.length - 1]; // 1 cent
    result.set(penny, (result.get(penny) || 0) + remaining);
    remaining = 0;
  }

  return result;
}

/**
 * Format a Map<denomination, count> into the required output string,
 * e.g. "1 dollar,2 quarters,1 nickel". Denominations are listed
 * largest to smallest, and zero counts are skipped.
 */
function formatChange(changeMap) {
  const parts = [];
  for (const denom of DENOMINATIONS) {
    const count = changeMap.get(denom);
    if (count && count > 0) {
      const word = count === 1 ? denom.singular : denom.plural;
      parts.push(`${count} ${word}`);
    }
  }
  return parts.length > 0 ? parts.join(",") : "No change due";
}

/**
 * Process a single "owed,paid" line and return the formatted change line.
 */
function processLine(line) {
  const trimmed = line.trim();
  if (trimmed === "") return null; // skip blank lines

  const [owedStr, paidStr] = trimmed.split(",").map((s) => s.trim());
  if (owedStr === undefined || paidStr === undefined) {
    return `Error: could not parse line "${line}"`;
  }

  let owedCents, paidCents;
  try {
    owedCents = toCents(owedStr);
    paidCents = toCents(paidStr);
  } catch (err) {
    return `Error: ${err.message}`;
  }

  if (owedCents < 0 || paidCents < 0) {
    return `Error: amounts cannot be negative (owed: "${owedStr}", paid: "${paidStr}")`;
  }

  const changeCents = paidCents - owedCents;
  if (changeCents < 0) {
    return `Error: amount paid ($${(paidCents / 100).toFixed(
      2
    )}) is less than amount owed ($${(owedCents / 100).toFixed(2)})`;
  }
  if (changeCents === 0) {
    return "No change due";
  }

  // If the amount owed is evenly divisible by RANDOM_CHANGE_DIVISOR, hand back random change.
  const useRandom = owedCents % RANDOM_CHANGE_DIVISOR === 0;
  const changeMap = useRandom
    ? randomChange(changeCents)
    : minimumChange(changeCents);

  return formatChange(changeMap);
}

function main() {
  const [, , inputPath, outputPath] = process.argv;

  if (!inputPath || !outputPath) {
    console.error("Usage: node cashRegister.js <input.txt> <output.txt>");
    process.exit(1);
  }

  const resolvedInput = path.resolve(inputPath);
  const resolvedOutput = path.resolve(outputPath);

  // --- Read the input file ---
  let inputText;
  try {
    inputText = fs.readFileSync(resolvedInput, "utf8");
  } catch (err) {
    console.error(`Error: failed to read input file "${resolvedInput}": ${err.message}`);
    process.exit(1);
  }

  // --- Process the lines ---
  let outputLines;
  try {
    const lines = inputText.split(/\r?\n/);
    outputLines = [];
    for (const line of lines) {
      const result = processLine(line);
      if (result !== null) {
        outputLines.push(result);
      }
    }
  } catch (err) {
    console.error(`Error: failed while processing input file "${resolvedInput}": ${err.message}`);
    process.exit(1);
  }

  // --- Write the output file ---
  try {
    fs.writeFileSync(resolvedOutput, outputLines.join("\n") + "\n", "utf8");
  } catch (err) {
    console.error(`Error: failed to write output file "${resolvedOutput}": ${err.message}`);
    process.exit(1);
  }

  console.log(`Wrote ${outputLines.length} line(s) to ${resolvedOutput}`);
}

main();

module.exports = { minimumChange, randomChange, formatChange, processLine };
