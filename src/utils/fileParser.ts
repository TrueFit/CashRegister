// Parse input file format: "owed,paid" per line

import type { InputLine } from '../core/types';

export function parseInputFile(content: string): InputLine[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const results: InputLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const parts = line.split(',');

    if (parts.length !== 2) {
      throw new Error(`Line ${i + 1}: Expected format "owed,paid" but got "${line}"`);
    }

    const owed = parseFloat(parts[0]);
    const paid = parseFloat(parts[1]);

    if (isNaN(owed) || isNaN(paid)) {
      throw new Error(`Line ${i + 1}: Invalid numbers in "${line}"`);
    }

    if (owed < 0 || paid < 0) {
      throw new Error(`Line ${i + 1}: Amounts cannot be negative`);
    }

    results.push({ owed, paid });
  }

  return results;
}
