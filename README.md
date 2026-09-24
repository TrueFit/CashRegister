# Creative Cash Draw Microservice

A high-efficiency, portable cash drawer microservice designed to maximize utility and correctness across diverse execution targets (Command Line CLI, AWS Lambda, or Docker/Kubernetes).

---

### Key Features

1. **Precision Change Calculation**: Uses integer currency units (cents) to completely eliminate floating-point rounding errors.
2. **Baseline Minimum Physical Change**: Computes optimal minimal denomination breakdown in descending order.
3. **Pluggable Special-Case Architecture**: Extensible plugin system allowing any custom transaction exceptions or promotional rules to be packaged independently.
4. **Packaged Divisible-by-Divisor Plugin**: Packaged exception for owed amounts divisible by 3 (or configured divisor) returning randomized denomination breakdowns.
5. **Preserved Newline Encoding**: Detects whether the input text uses Windows CRLF (`\r\n`), Unix LF (`\n`), or classic Mac CR (`\r`), and faithfully reproduces the identical newline format in the output.
6. **Externalized Configuration**: Configurable currency, decimal separator (default `.`), divisor (default `3`), and denomination sets via `config/default.json` or custom configuration paths.
7. **Multi-Environment Support**:
   - **CLI with Test Mode**: Run transactions or execute self-test diagnostics directly from the command line.
   - **AWS Lambda**: Native serverless handler supporting API Gateway, S3, or direct JSON invocations.
   - **Portable Kubernetes / Docker Container**: Lightweight HTTP server with `/healthz`, `/readyz`, and `/process` endpoints.

---

### Special Case Plugin Architecture

Special case calculation exceptions (such as the divisible-by-3 randomized change rule, rounding promotions, or custom denomination constraints) are packaged as modular plugins conforming to the `SpecialCasePlugin` interface.

#### 1. The `SpecialCasePlugin` Interface

Every plugin implements two core methods:
- `isApplicable(context)`: Returns a boolean indicating whether the rule applies given `{ owedCents, paidCents, changeCents, denominations, config, options, rng }`.
- `calculate(context)`: Calculates and returns `{ changeCents, breakdown, isRandom, pluginName, metadata }`.

```javascript
const { SpecialCasePlugin } = require('./src/plugins');

class NoPenniesPromotionPlugin extends SpecialCasePlugin {
  constructor() {
    super({
      name: 'NoPenniesPromotionPlugin',
      description: 'Rounds remaining change to nickels when promo flag is set',
      priority: 50 // Lower priority runs first
    });
  }

  isApplicable(context) {
    return context.options && context.options.noPennies === true;
  }

  calculate(context) {
    // Custom change breakdown logic
    return {
      changeCents: context.changeCents,
      pluginName: this.name,
      breakdown: [ /* ... */ ]
    };
  }
}
```

#### 2. Built-in `RandomChangeWithDivisorPlugin`

The exception for owed amounts divisible by 3 is packaged in `src/plugins/RandomChangeWithDivisorPlugin.js`. It checks if `owedCents % divisor === 0` and calculates randomized change breakdowns that match the exact change amount.

#### 3. Managing Plugins with `PluginRegistry`

```javascript
const { PluginRegistry, RandomChangeWithDivisorPlugin, defaultRegistry } = require('./src/plugins');

// Create custom registry or register to default singleton
const registry = new PluginRegistry();
registry.register(new RandomChangeWithDivisorPlugin({ randomDivisor: 3 }));
registry.register(new CustomSpecialCasePlugin());
```

---

### Configuration (`config/default.json`)

```json
{
  "currency": "USD",
  "decimalSeparator": ".",
  "zeroChangeMessage": "0 pennies",
  "plugins": {
    "RandomChangeWithDivisorPlugin": {
      "randomDivisor": 3
    }
  },
  "currencies": {
    "USD": {
      "name": "US Dollar",
      "symbol": "$",
      "smallestUnit": "penny",
      "smallestUnitPlural": "pennies",
      "multiplier": 100,
      "denominations": [
        { "name": "dollar", "plural": "dollars", "value": 100 },
        { "name": "quarter", "plural": "quarters", "value": 25 },
        { "name": "dime", "plural": "dimes", "value": 10 },
        { "name": "nickel", "plural": "nickels", "value": 5 },
        { "name": "penny", "plural": "pennies", "value": 1 }
      ]
    }
  }
}
```

#### Configuration Retrieval Helper (`getConfigValue`)

The microservice provides a universal helper function `getConfigValue` for concise, safe, and readable configuration lookups:

```javascript
const { getConfigValue } = require('./src/config');

// Path resolution with fallback and type validation
const divisor = getConfigValue(
  context && context.config,
  'plugins.RandomChangeWithDivisorPlugin.randomDivisor',
  3,
  'number'
);
```

---

### Command Line Interface (CLI)

#### Run CLI Tests
```bash
node src/cli.js --test
# or
npm test
```

#### Process Input File to Output File
```bash
node src/cli.js -i sample/input.txt -o sample/output.txt
```

#### Process with Custom Config
```bash
node src/cli.js -i sample/input.txt -o sample/output.txt -c path/to/custom_config.json
```

---

### AWS Lambda Deployment

Exported in `src/lambda.js` or root `index.js`:
- Handler: `src/lambda.handler` (or `index.handler`)
- Supports direct JSON `{ "input": "1.00,2.33\n" }` and API Gateway text payloads.

---

### Kubernetes & Container Deployment

Build container:
```bash
docker build -t creative-cash-draw:latest .
```

Deploy to Kubernetes:
```bash
kubectl apply -f k8s/deployment.yaml
```
