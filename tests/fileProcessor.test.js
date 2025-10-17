/**
 * Unit tests for file processor module
 */

import { processFile, readAndProcess } from '../src/fileProcessor.js';
import fs from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('File Processor Module', () => {
  let tempDir;
  let testInputFile;
  let testOutputFile;

  beforeEach(async () => {
    // Create temporary directory for test files
    tempDir = join(tmpdir(), `cash-register-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    testInputFile = join(tempDir, 'input.txt');
    testOutputFile = join(tempDir, 'output.txt');
  });

  afterEach(async () => {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('processFile', () => {
    test('processes valid input file successfully', async () => {
      const inputContent = '2.12,3.00\n1.97,2.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const result = await processFile(testInputFile, testOutputFile, { enableRandom: false });

      expect(result.success).toBe(true);
      expect(result.linesProcessed).toBe(2);
      expect(result.errors).toHaveLength(0);

      // Verify output file content
      const outputContent = await fs.readFile(testOutputFile, 'utf-8');
      const lines = outputContent.trim().split('\n');
      expect(lines[0]).toBe('3 quarters,1 dime,3 pennies');
      expect(lines[1]).toBe('3 pennies');
    });

    test('handles empty lines in input', async () => {
      const inputContent = '2.12,3.00\n\n1.97,2.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const result = await processFile(testInputFile, testOutputFile, { enableRandom: false });

      expect(result.success).toBe(true);
      expect(result.linesProcessed).toBe(2); // Empty lines are filtered
    });

    test('continues processing after error on one line', async () => {
      const inputContent = '2.12,3.00\ninvalid,line\n1.97,2.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const result = await processFile(testInputFile, testOutputFile, { enableRandom: false });

      expect(result.success).toBe(false);
      expect(result.linesProcessed).toBe(3);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].line).toBe(2);
      expect(result.errors[0].content).toBe('invalid,line');

      // Verify output still contains valid results
      const outputContent = await fs.readFile(testOutputFile, 'utf-8');
      const lines = outputContent.trim().split('\n');
      expect(lines[0]).toBe('3 quarters,1 dime,3 pennies');
      expect(lines[1]).toContain('ERROR');
      expect(lines[2]).toBe('3 pennies');
    });

    test('throws error for non-existent input file', async () => {
      await expect(
        processFile('/nonexistent/file.txt', testOutputFile)
      ).rejects.toThrow('File processing failed');
    });

    test('throws error for empty input file', async () => {
      await fs.writeFile(testInputFile, '');

      await expect(
        processFile(testInputFile, testOutputFile)
      ).rejects.toThrow('empty');
    });

    test('processes file with multiple transactions', async () => {
      const inputContent = '2.12,3.00\n1.97,2.00\n3.33,5.00\n5.00,10.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const result = await processFile(testInputFile, testOutputFile, { enableRandom: false });

      expect(result.success).toBe(true);
      expect(result.linesProcessed).toBe(4);

      const outputContent = await fs.readFile(testOutputFile, 'utf-8');
      const lines = outputContent.trim().split('\n');
      expect(lines).toHaveLength(4);
    });
  });

  describe('readAndProcess', () => {
    test('reads and processes file returning array of results', async () => {
      const inputContent = '2.12,3.00\n1.97,2.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const results = await readAndProcess(testInputFile, { enableRandom: false });

      expect(results).toHaveLength(2);
      expect(results[0]).toBe('3 quarters,1 dime,3 pennies');
      expect(results[1]).toBe('3 pennies');
    });

    test('filters empty lines', async () => {
      const inputContent = '2.12,3.00\n\n\n1.97,2.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const results = await readAndProcess(testInputFile, { enableRandom: false });

      expect(results).toHaveLength(2);
    });

    test('throws error for non-existent file', async () => {
      await expect(
        readAndProcess('/nonexistent/file.txt')
      ).rejects.toThrow();
    });
  });

  describe('Integration with options', () => {
    test('respects custom currency configuration', async () => {
      const inputContent = '2.12,3.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const result = await processFile(testInputFile, testOutputFile, {
        currency: 'USD',
        enableRandom: false
      });

      expect(result.success).toBe(true);
    });

    test('respects random divisor configuration', async () => {
      const inputContent = '1.00,2.00\n';
      await fs.writeFile(testInputFile, inputContent);

      const result = await processFile(testInputFile, testOutputFile, {
        randomDivisor: 5,
        enableRandom: true
      });

      expect(result.success).toBe(true);

      const outputContent = await fs.readFile(testOutputFile, 'utf-8');
      expect(outputContent).toBeTruthy();
    });
  });
});
