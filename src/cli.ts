#!/usr/bin/env node
// Minimal CLI entry point - reuses existing business logic

import { readFileSync } from 'node:fs';
import { parseInputFile } from './utils/fileParser';
import { calculateChange, DEFAULT_CONFIG } from './core/changeCalculator';
import { formatChange } from './utils/formatters';
import { USD } from './core/currency';
import type { CalculatorConfig } from './core/types';

function readFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    console.error(`Error: Cannot read file "${filePath}"`);
    process.exit(1);
  }
}

function parseArgs(args: string[]): { filePath: string; config: CalculatorConfig } {
  const config: CalculatorConfig = { ...DEFAULT_CONFIG };
  let filePath = '';

  for (const arg of args) {
    if (arg.startsWith('--divisor=')) {
      const value = parseInt(arg.slice('--divisor='.length), 10);
      if (isNaN(value) || value <= 0) {
        console.error('Error: --divisor must be a positive integer');
        process.exit(1);
      }
      config.randomDivisor = value;
    } else if (arg.startsWith('--random=')) {
      const value = arg.slice('--random='.length).toLowerCase();
      if (value !== 'true' && value !== 'false') {
        console.error('Error: --random must be true or false');
        process.exit(1);
      }
      config.randomEnabled = value === 'true';
    } else if (!arg.startsWith('-')) {
      filePath = arg;
    }
  }

  return { filePath, config };
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: npx tsx src/cli.ts <input-file> [options]

Options:
  --divisor=<n>      Set random divisor (default: 3)
  --random=<bool>    Enable/disable random mode (default: true)
  --help, -h         Show this help

Example:
  npx tsx src/cli.ts sample-input.txt
  npx tsx src/cli.ts input.txt --divisor=5 --random=false`);
    process.exit(0);
  }

  const { filePath, config } = parseArgs(args);

  if (!filePath) {
    console.error('Error: No input file specified');
    process.exit(1);
  }

  const content = readFile(filePath);
  const lines = parseInputFile(content);

  for (const line of lines) {
    const result = calculateChange(line.owed, line.paid, config, USD);
    const output = formatChange(result.denominations, USD);
    console.log(output || '0 change');
  }
}

main();
