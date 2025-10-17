/**
 * File Processor Module
 *
 * Handles reading input files and writing output files
 */

import fs from 'fs/promises';
import { processLine } from './changeCalculator.js';

/**
 * Process an input file and generate output
 * @param {string} inputPath - Path to input file
 * @param {string} outputPath - Path to output file
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Processing results
 */
export async function processFile(inputPath, outputPath, options = {}) {
  try {
    // Read input file
    const content = await fs.readFile(inputPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error('Input file is empty');
    }

    // Process each line
    const results = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
      try {
        const result = processLine(lines[i], options);
        results.push(result);
      } catch (error) {
        errors.push({
          line: i + 1,
          content: lines[i],
          error: error.message
        });
        // Continue processing other lines
        results.push(`ERROR: ${error.message}`);
      }
    }

    // Write output file
    const output = results.join('\n') + '\n';
    await fs.writeFile(outputPath, output, 'utf-8');

    return {
      success: errors.length === 0,
      linesProcessed: lines.length,
      errors
    };
  } catch (error) {
    throw new Error(`File processing failed: ${error.message}`);
  }
}

/**
 * Read and process input file content
 * @param {string} inputPath - Path to input file
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} Array of change results
 */
export async function readAndProcess(inputPath, options = {}) {
  const content = await fs.readFile(inputPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  return lines.map(line => processLine(line, options));
}

export default {
  processFile,
  readAndProcess
};
