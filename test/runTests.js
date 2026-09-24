const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const {
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
} = require('../index');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

async function runAll() {
  console.log('====================================================');
  console.log('   Creative Cash Draw - Full Automated Test Suite   ');
  console.log('====================================================\n');

  console.log('Testing: Parser & Newline Detection');
  it('detectNewline identifies CRLF, LF, and CR', () => {
    assert.strictEqual(detectNewline('a\r\nb\r\n'), '\r\n');
    assert.strictEqual(detectNewline('a\nb\n'), '\n');
    assert.strictEqual(detectNewline('a\rb\r'), '\r');
    assert.strictEqual(detectNewline('single line'), '\n');
  });

  it('parseCurrencyAmount parses standard and non-decimal numbers to integer units', () => {
    assert.strictEqual(parseCurrencyAmount('1.33'), 133);
    assert.strictEqual(parseCurrencyAmount('1.00'), 100);
    assert.strictEqual(parseCurrencyAmount('5'), 500);
    assert.strictEqual(parseCurrencyAmount('0.05'), 5);
    assert.strictEqual(parseCurrencyAmount('0.01'), 1);
    assert.strictEqual(parseCurrencyAmount('$3.33'), 333);
  });

  it('parseCurrencyAmount supports custom decimal separator (comma)', () => {
    assert.strictEqual(parseCurrencyAmount('1,33', ','), 133);
    assert.strictEqual(parseCurrencyAmount('5,00', ','), 500);
    assert.strictEqual(parseCurrencyAmount('0,05', ','), 5);
  });

  it('parseInputLine parses owed and paid with different delimiters', () => {
    const res1 = parseInputLine('1.33, 2.00');
    assert.deepStrictEqual(res1, { owedCents: 133, paidCents: 200, owedRaw: '1.33', paidRaw: '2.00' });

    const res2 = parseInputLine('1.33\t2.00');
    assert.deepStrictEqual(res2, { owedCents: 133, paidCents: 200, owedRaw: '1.33', paidRaw: '2.00' });

    const res3 = parseInputLine('1,33; 2,00', ',');
    assert.deepStrictEqual(res3, { owedCents: 133, paidCents: 200, owedRaw: '1,33', paidRaw: '2,00' });
  });

  console.log('\nTesting: Formatter & Pluralization');
  it('formatChange formats singular and plural denominations in descending order', () => {
    const denoms = [
      { name: 'dollar', plural: 'dollars', value: 100, count: 1 },
      { name: 'quarter', plural: 'quarters', value: 25, count: 1 },
      { name: 'nickel', plural: 'nickels', value: 5, count: 1 },
      { name: 'penny', plural: 'pennies', value: 1, count: 3 }
    ];
    assert.strictEqual(formatChange(denoms), '1 dollar, 1 quarter, 1 nickel, 3 pennies');

    const multi = [
      { name: 'dollar', plural: 'dollars', value: 100, count: 2 },
      { name: 'quarter', plural: 'quarters', value: 25, count: 3 },
      { name: 'penny', plural: 'pennies', value: 1, count: 1 }
    ];
    assert.strictEqual(formatChange(multi), '2 dollars, 3 quarters, 1 penny');
  });

  it('formatChange omits zero counts and handles 0 change', () => {
    const zeroList = [
      { name: 'dollar', plural: 'dollars', value: 100, count: 0 },
      { name: 'quarter', plural: 'quarters', value: 25, count: 0 }
    ];
    assert.strictEqual(formatChange(zeroList), '0 pennies');
  });

  console.log('\nTesting: Special Case Plugin Architecture');
  const usdDenominations = [
    { name: 'dollar', plural: 'dollars', value: 100 },
    { name: 'quarter', plural: 'quarters', value: 25 },
    { name: 'dime', plural: 'dimes', value: 10 },
    { name: 'nickel', plural: 'nickels', value: 5 },
    { name: 'penny', plural: 'pennies', value: 1 }
  ];

  it('SpecialCasePlugin base class validates contract and throws on un-implemented methods', () => {
    class IncompletePlugin extends SpecialCasePlugin {}
    const instance = new IncompletePlugin({ name: 'Incomplete' });
    
    assert.throws(() => {
      instance.isApplicable({});
    }, /must implement isApplicable/);

    assert.throws(() => {
      instance.calculate({});
    }, /must implement calculate/);

    assert.strictEqual(SpecialCasePlugin.validate(instance), true);
    assert.throws(() => SpecialCasePlugin.validate({}), /Plugin must have a non-empty string "name"/);
    assert.throws(() => SpecialCasePlugin.validate({ name: 'test' }), /must implement "isApplicable\(context\)"/);
  });

  it('RandomChangeWithDivisorPlugin correctly identifies applicable transactions and calculates randomized breakdown', () => {
    const defaultPlugin = new RandomChangeWithDivisorPlugin();
    assert.strictEqual(defaultPlugin.divisor, 3);

    const customPlugin = new RandomChangeWithDivisorPlugin({ plugins: { RandomChangeWithDivisorPlugin: { randomDivisor: 5 } } });
    assert.strictEqual(customPlugin.divisor, 5);

    const plugin = new RandomChangeWithDivisorPlugin({ randomDivisor: 3 });
    assert.strictEqual(plugin.divisor, 3);
    
    // Divisible by 3 (333 cents owed, 500 paid -> 167 change)
    assert.strictEqual(plugin.isApplicable({ owedCents: 333, changeCents: 167 }), true);
    // Not divisible by 3 (100 cents owed)
    assert.strictEqual(plugin.isApplicable({ owedCents: 100, changeCents: 133 }), false);

    const fixedRng = (() => {
      const vals = [0.9, 0.4, 0.0, 0.7];
      let idx = 0;
      return () => (idx < vals.length ? vals[idx++] : 0);
    })();

    const result = plugin.calculate({
      owedCents: 333,
      paidCents: 500,
      changeCents: 167,
      denominations: usdDenominations,
      rng: fixedRng
    });

    assert.strictEqual(result.isRandom, true);
    assert.strictEqual(result.pluginName, 'RandomChangeWithDivisorPlugin');
    assert.strictEqual(formatChange(result.breakdown), '1 dollar, 1 quarter, 6 nickels, 12 pennies');
  });

  it('PluginRegistry registers, unregisters, sorts by priority, and executes plugins', () => {
    const registry = new PluginRegistry();
    
    // Create a custom special case plugin: "AllQuartersPlugin" (gives all change in quarters and pennies)
    class AllQuartersPlugin extends SpecialCasePlugin {
      constructor() {
        super({ name: 'AllQuartersPlugin', priority: 50 });
      }
      isApplicable(context) {
        return context.options && context.options.preferQuarters === true;
      }
      calculate(context) {
        let remaining = context.changeCents;
        const quarters = Math.floor(remaining / 25);
        remaining -= quarters * 25;
        const pennies = remaining;
        return {
          changeCents: context.changeCents,
          isRandom: false,
          pluginName: this.name,
          breakdown: [
            { name: 'quarter', plural: 'quarters', value: 25, count: quarters },
            { name: 'penny', plural: 'pennies', value: 1, count: pennies }
          ]
        };
      }
    }

    const customPlugin = new AllQuartersPlugin();
    registry.register(new RandomChangeWithDivisorPlugin({ priority: 100 }));
    registry.register(customPlugin);

    assert.strictEqual(registry.has('AllQuartersPlugin'), true);
    assert.strictEqual(registry.getAll()[0].name, 'AllQuartersPlugin'); // lower priority number comes first

    // Test execution with custom option triggering the AllQuartersPlugin
    const result = calculateChange(100, 200, usdDenominations, {
      preferQuarters: true,
      pluginRegistry: registry
    });

    assert.strictEqual(result.pluginName, 'AllQuartersPlugin');
    assert.strictEqual(formatChange(result.breakdown), '4 quarters');

    // Unregister and verify it falls back to baseline
    registry.unregister('AllQuartersPlugin');
    assert.strictEqual(registry.has('AllQuartersPlugin'), false);
  });

  console.log('\nTesting: Change Calculator');

  it('calculateChange computes baseline minimum change when owed is not divisible by divisor', () => {
    // $1.00 owed (100 is not divisible by 3), $2.33 paid -> change $1.33 (133 cents)
    const result = calculateChange(100, 233, usdDenominations);
    assert.strictEqual(result.isRandom, false);
    assert.strictEqual(result.changeCents, 133);
    const formatted = formatChange(result.breakdown);
    assert.strictEqual(formatted, '1 dollar, 1 quarter, 1 nickel, 3 pennies');
  });

  it('calculateChange computes random change when owed is divisible by divisor 3', () => {
    // $3.33 owed (333 % 3 === 0), $5.00 paid -> change $1.67 (167 cents)
    // Deterministic RNG simulation for prompt example
    const fixedRng = (() => {
      const vals = [0.9, 0.4, 0.0, 0.7];
      let idx = 0;
      return () => (idx < vals.length ? vals[idx++] : 0);
    })();

    const result = calculateChange(333, 500, usdDenominations, { rng: fixedRng });
    assert.strictEqual(result.isRandom, true);
    assert.strictEqual(result.changeCents, 167);
    const formatted = formatChange(result.breakdown);
    assert.strictEqual(formatted, '1 dollar, 1 quarter, 6 nickels, 12 pennies');

    // Verify sum of breakdown equals total change
    const sum = result.breakdown.reduce((acc, d) => acc + d.count * d.value, 0);
    assert.strictEqual(sum, 167);
  });

  it('calculateChange ensures random change always sums to exact change across 100 random runs', () => {
    for (let i = 0; i < 100; i++) {
      const owed = (Math.floor(Math.random() * 100) + 1) * 3; // Guaranteed divisible by 3
      const paid = owed + Math.floor(Math.random() * 1000) + 1;
      const expectedChange = paid - owed;

      const result = calculateChange(owed, paid, usdDenominations);
      assert.strictEqual(result.isRandom, true);
      const sum = result.breakdown.reduce((acc, d) => acc + d.count * d.value, 0);
      assert.strictEqual(sum, expectedChange);
    }
  });

  it('calculateChange throws error on insufficient payment', () => {
    assert.throws(() => {
      calculateChange(500, 300, usdDenominations);
    }, /Insufficient payment/);
  });

  console.log('\nTesting: End-to-End Service & Preserving Newline Style');
  it('processTransactions preserves CRLF newline style', () => {
    const input = '1.00,2.33\r\n2.00,3.00\r\n';
    const output = processTransactions(input);
    assert.strictEqual(output, '1 dollar, 1 quarter, 1 nickel, 3 pennies\r\n1 dollar\r\n');
  });

  it('processTransactions preserves LF newline style without trailing newline', () => {
    const input = '1.00,2.33\n2.00,3.00';
    const output = processTransactions(input);
    assert.strictEqual(output, '1 dollar, 1 quarter, 1 nickel, 3 pennies\n1 dollar');
  });

  console.log('\nTesting: Configuration & getConfigValue Helper');
  it('getConfigValue resolves values from nested paths, multi-sources, type validators, and fallbacks', () => {
    const config = {
      nested: { a: { b: 42 } },
      str: 'hello',
      num: 10
    };
    assert.strictEqual(getConfigValue(config, 'nested.a.b'), 42);
    assert.strictEqual(getConfigValue(config, 'missing.key', 'fallback'), 'fallback');
    assert.strictEqual(getConfigValue(config, ['missing.key', 'nested.a.b']), 42);
    assert.strictEqual(getConfigValue(config, 'str', 100, 'number'), 100);
    assert.strictEqual(getConfigValue(config, 'num', 100, (v) => v > 5), 10);
    assert.strictEqual(getConfigValue([{}, { num: 99 }], 'num'), 99);
    assert.strictEqual(getConfigValue(null, 'key', 'default'), 'default');
  });

  it('loadConfig properly loads nested plugin configuration and defaults randomDivisor', () => {
    const config = loadConfig();
    assert.ok(config.plugins && typeof config.plugins === 'object');
    assert.ok(config.plugins.RandomChangeWithDivisorPlugin && typeof config.plugins.RandomChangeWithDivisorPlugin === 'object');
    assert.strictEqual(config.plugins.RandomChangeWithDivisorPlugin.randomDivisor, 3);

    const overridden = loadConfig({ plugins: { RandomChangeWithDivisorPlugin: { randomDivisor: 5 } } });
    assert.strictEqual(overridden.plugins.RandomChangeWithDivisorPlugin.randomDivisor, 5);
  });

  it('processTransactions supports custom configuration file and divisor in plugin-specific configuration section', () => {
    const customCfg = {
      decimalSeparator: '.',
      plugins: {
        RandomChangeWithDivisorPlugin: {
          randomDivisor: 7
        }
      }
    };
    // 700 owed (divisible by 7)
    const out = processTransactions('7.00,10.00', customCfg);
    assert.ok(out.length > 0);
  });

  console.log('\nTesting: AWS Lambda Handler & HTTP Server Integration');
  await itAsync('Lambda handler processes direct payload and API Gateway events', async () => {
    const directRes = await handler({ input: '1.00,2.33\n' });
    assert.strictEqual(directRes.statusCode, 200);
    assert.strictEqual(directRes.output, '1 dollar, 1 quarter, 1 nickel, 3 pennies\n');

    const apiGatewayRes = await handler({
      httpMethod: 'POST',
      body: '1.00,2.33\n',
      headers: { 'Content-Type': 'text/plain' }
    });
    assert.strictEqual(apiGatewayRes.statusCode, 200);
    assert.strictEqual(apiGatewayRes.body, '1 dollar, 1 quarter, 1 nickel, 3 pennies\n');
  });

  await itAsync('HTTP Server serves /healthz and /process endpoints', async () => {
    const server = startServer(9099, '127.0.0.1');

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test /healthz
    const healthz = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9099/healthz', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      }).on('error', reject);
    });
    assert.strictEqual(healthz.statusCode, 200);
    assert.ok(JSON.parse(healthz.body).status === 'UP');

    // Test POST /process
    const postRes = await new Promise((resolve, reject) => {
      const req = http.request('http://127.0.0.1:9099/process', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write('1.00,2.33\n');
      req.end();
    });
    assert.strictEqual(postRes.statusCode, 200);
    assert.strictEqual(postRes.body, '1 dollar, 1 quarter, 1 nickel, 3 pennies\n');

    await new Promise((resolve) => server.close(resolve));
  });

  console.log('\n====================================================');
  console.log(`Summary: ${passedTests}/${totalTests} tests passed (${failedTests} failed).`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
