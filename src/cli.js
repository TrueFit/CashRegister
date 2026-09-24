#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { processTransactions } = require('./service');

/**
 * Parses CLI arguments.
 */
function parseArgs(args) {
  const options = {
    input: null,
    output: null,
    config: null,
    test: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--test' || arg === '-t') {
      options.test = true;
    } else if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--config' || arg === '-c') {
      options.config = args[++i];
    } else if (!arg.startsWith('-')) {
      if (!options.input) {
        options.input = arg;
      } else if (!options.output) {
        options.output = arg;
      } else if (!options.config) {
        options.config = arg;
      }
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Creative Cash Draw - Microservice CLI

Usage:
  node src/cli.js [options]
  node src/cli.js <input_file> [output_file] [config_file]

Options:
  -i, --input <file>     Path to the plain text input file
  -o, --output <file>    Path to the output file (defaults to stdout)
  -c, --config <file>    Path to the JSON configuration file
  -t, --test             Run self-test suite from command line
  -h, --help             Show this help message

Examples:
  node src/cli.js -i sample/input.txt -o sample/output.txt
  node src/cli.js sample/input.txt
  node src/cli.js --test
`);
}

/**
 * Runs built-in CLI self-test.
 */
function runSelfTest() {
  console.log('Running Cash Drawer Microservice Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  try {
    // Test 1: Baseline minimum change ($1.33 change from $2.00 paid, $0.67 owed or owed 1.00 paid 2.33)
    // Note: owed $1.00 (100 cents - not divisible by 3), paid $2.33 -> change $1.33
    const res1 = processTransactions('1.00,2.33');
    assert(res1.trim() === '1 dollar, 1 quarter, 1 nickel, 3 pennies', 'Baseline change for $1.33 ($1.00 owed, $2.33 paid)');

    // Test 2: Random change when owed is divisible by 3 (owed $3.33 = 333 cents, paid $5.00)
    const fixedRng = (function() {
      // Return fixed values to mimic prompt's example: '1 dollar, 1 quarter, 6 nickels, 12 pennies'
      // 167 total cents:
      // dollar (100): max 1 -> rng returns 0.9 (1) -> remaining 67
      // quarter (25): max 2 -> rng returns 0.4 (1) -> remaining 42
      // dime (10): max 4 -> rng returns 0.0 (0) -> remaining 42
      // nickel (5): max 8 -> rng returns 0.7 (6) -> remaining 12
      // penny (1): absorbs 12
      const vals = [0.9, 0.4, 0.0, 0.7];
      let idx = 0;
      return () => (idx < vals.length ? vals[idx++] : 0);
    })();
    const res2 = processTransactions('3.33,5.00', null, fixedRng);
    assert(res2.trim() === '1 dollar, 1 quarter, 6 nickels, 12 pennies', 'Random change calculation when owed is divisible by 3');

    // Test 3: Newline detection CRLF
    const crlfInput = '1.00,2.00\r\n2.00,3.00\r\n';
    const crlfOutput = processTransactions(crlfInput);
    assert(crlfOutput.includes('\r\n') && !crlfOutput.replace(/\r\n/g, '').includes('\n'), 'CRLF newline style preserved');

    // Test 4: Newline detection LF
    const lfInput = '1.00,2.00\n2.00,3.00\n';
    const lfOutput = processTransactions(lfInput);
    assert(lfOutput.includes('\n') && !lfOutput.includes('\r'), 'LF newline style preserved');

    // Test 5: Custom decimal separator
    const customConfig = {
      decimalSeparator: ',',
      currency: 'USD',
      plugins: {
        RandomChangeWithDivisorPlugin: {
          randomDivisor: 3
        }
      }
    };
    const commaOutput = processTransactions('1,00;2,33', customConfig);
    assert(commaOutput.trim() === '1 dollar, 1 quarter, 1 nickel, 3 pennies', 'Custom comma decimal separator parsed correctly');

    // Test 6: Zero change
    const zeroOutput = processTransactions('5.00,5.00');
    assert(zeroOutput.trim() === '0 pennies', 'Zero change handling');

    console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Self-test error:', err);
    process.exit(1);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.test) {
    runSelfTest();
    return;
  }

  let inputText = '';

  if (options.input) {
    const inputPath = path.resolve(process.cwd(), options.input);
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: Input file does not exist at ${inputPath}`);
      process.exit(1);
    }
    inputText = fs.readFileSync(inputPath, 'utf8');
  } else if (!process.stdin.isTTY) {
    // Read from standard input pipe
    inputText = await new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
      process.stdin.on('error', reject);
    });
  } else {
    printHelp();
    process.exit(1);
  }

  const outputText = processTransactions(inputText, options.config);

  if (options.output) {
    const outputPath = path.resolve(process.cwd(), options.output);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, outputText, 'utf8');
    console.log(`Output successfully written to ${outputPath}`);
  } else {
    process.stdout.write(outputText);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal execution error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  parseArgs,
  runSelfTest,
  main
};
