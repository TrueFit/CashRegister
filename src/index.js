#!/usr/bin/env node

/**
 * Cash Register CLI Application
 *
 * Command-line interface for processing cash register transactions
 */

import { processFile } from './fileProcessor.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Display usage information
 */
function displayUsage() {
  console.log(`
Cash Register - Change Calculator

Usage:
  node src/index.js <input-file> [output-file] [options]

Arguments:
  input-file    Path to input file (required)
  output-file   Path to output file (default: output.txt)

Options:
  --currency=CODE       Currency code (default: USD)
  --random-divisor=N    Divisor for random strategy (default: 3)
  --no-random          Disable random strategy
  --help               Display this help message

Examples:
  node src/index.js input.txt
  node src/index.js input.txt output.txt
  node src/index.js input.txt output.txt --currency=EUR
  node src/index.js input.txt output.txt --random-divisor=5
  node src/index.js input.txt output.txt --no-random

Input Format:
  Each line should contain: amount_owed,amount_paid
  Example: 2.13,3.00

Output Format:
  Each line contains the change breakdown
  Example: 3 quarters,1 dime,2 pennies
`);
}

/**
 * Parse command-line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    displayUsage();
    process.exit(0);
  }

  const config = {
    inputFile: null,
    outputFile: 'output.txt',
    options: {
      currency: 'USD',
      randomDivisor: 3,
      enableRandom: true
    }
  };

  // Parse positional arguments
  const positional = args.filter(arg => !arg.startsWith('--'));
  config.inputFile = positional[0];
  if (positional[1]) {
    config.outputFile = positional[1];
  }

  // Parse options
  for (const arg of args) {
    if (arg.startsWith('--currency=')) {
      config.options.currency = arg.split('=')[1].toUpperCase();
    } else if (arg.startsWith('--random-divisor=')) {
      config.options.randomDivisor = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--no-random') {
      config.options.enableRandom = false;
    }
  }

  if (!config.inputFile) {
    console.error('Error: Input file is required');
    displayUsage();
    process.exit(1);
  }

  return config;
}

/**
 * Main function
 */
async function main() {
  try {
    const config = parseArguments();

    console.log('Cash Register - Processing transactions...');
    console.log(`Input:  ${config.inputFile}`);
    console.log(`Output: ${config.outputFile}`);
    console.log(`Currency: ${config.options.currency}`);
    console.log(`Random divisor: ${config.options.randomDivisor}`);
    console.log(`Random strategy: ${config.options.enableRandom ? 'enabled' : 'disabled'}`);
    console.log('');

    // Process the file
    const result = await processFile(
      config.inputFile,
      config.outputFile,
      config.options
    );

    // Display results
    if (result.success) {
      console.log(`✓ Successfully processed ${result.linesProcessed} transactions`);
      console.log(`✓ Output written to ${config.outputFile}`);
    } else {
      console.log(`⚠ Processed ${result.linesProcessed} transactions with ${result.errors.length} errors`);
      console.log(`✓ Output written to ${config.outputFile}`);
      console.log('');
      console.log('Errors:');
      for (const error of result.errors) {
        console.log(`  Line ${error.line}: ${error.error}`);
        console.log(`    Content: ${error.content}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the application
main();
