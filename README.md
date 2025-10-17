# Cash Register - Change Calculator

A flexible and extensible CLI application that calculates the optimal change denominations for cash register transactions. Built with Node.js and designed with scalability and maintainability in mind.

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Features

- **Smart Change Calculation**: Uses greedy algorithm to minimize the number of coins/bills
- **Random Distribution Mode**: Special case for amounts divisible by a configurable number
- **Multi-Currency Support**: Easily extensible for different currencies (USD, EUR, etc.)
- **Configurable Rules**: Customize the random divisor and special case rules
- **File I/O Processing**: Batch process multiple transactions from input files
- **Comprehensive Tests**: Full unit test coverage with Jest
- **Clean Architecture**: Modular design following SOLID principles

## Installation

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)

### Setup

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Usage

### Basic Usage

```bash
node src/index.js <input-file> [output-file] [options]
```

### Arguments

- `input-file` (required): Path to the input file containing transactions
- `output-file` (optional): Path to the output file (default: `output.txt`)

### Options

- `--currency=CODE`: Currency code (default: `USD`)
- `--random-divisor=N`: Divisor for random strategy (default: `3`)
- `--no-random`: Disable random strategy
- `--help`: Display help message

### Examples

**Basic usage with sample file:**
```bash
node src/index.js examples/input.txt
```

**Specify output file:**
```bash
node src/index.js examples/input.txt results.txt
```

**Change random divisor to 5:**
```bash
node src/index.js examples/input.txt output.txt --random-divisor=5
```

**Disable random strategy:**
```bash
node src/index.js examples/input.txt output.txt --no-random
```

**Use different currency (EUR):**
```bash
node src/index.js examples/input.txt output.txt --currency=EUR
```

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

## Project Structure

```
cash-register/
├── src/
│   ├── index.js              # CLI entry point
│   ├── changeCalculator.js   # Main change calculation logic
│   ├── changeStrategies.js   # Minimum and random change strategies
│   ├── currencyConfig.js     # Currency denominations configuration
│   ├── fileProcessor.js      # File I/O handler
│   └── utils.js              # Helper functions
├── tests/
│   ├── changeCalculator.test.js
│   ├── changeStrategies.test.js
│   ├── fileProcessor.test.js
│   └── utils.test.js
├── examples/
│   ├── input.txt             # Sample input file
│   └── expected-output.txt   # Expected output (with random line)
├── package.json
└── README.md
```

## Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage report:

```bash
npm run test:coverage
```

## How It Works

### Change Calculation Strategies

1. **Minimum Change Strategy** (default):
   - Uses a greedy algorithm to minimize the number of coins/bills
   - Iterates through denominations from largest to smallest
   - Always produces the optimal solution for standard coin systems

2. **Random Change Strategy** (special case):
   - Activated when the change amount is divisible by the configured divisor (default: 3)
   - Randomly selects denominations while ensuring the total is correct
   - Produces varied but mathematically valid results

### Algorithm Flow

1. Read input file and parse transactions
2. For each transaction:
   - Calculate change amount (paid - owed)
   - Convert to cents to avoid floating-point precision issues
   - Determine strategy based on divisibility rules
   - Calculate denomination breakdown
   - Format output string
3. Write results to output file

## Extensibility

### Adding New Currencies

Edit [src/currencyConfig.js](src/currencyConfig.js) to add new currency configurations:

```javascript
export const GBP_DENOMINATIONS = [
  { value: 20000, name: 'twenty pound note', pluralName: 'twenty pound notes' },
  { value: 10000, name: 'ten pound note', pluralName: 'ten pound notes' },
  // ... add all denominations
];

export const CURRENCY_CONFIGS = {
  USD: { ... },
  EUR: { ... },
  GBP: {
    denominations: GBP_DENOMINATIONS,
    symbol: '£',
    decimalPlaces: 2
  }
};
```

### Adding New Special Cases

Modify [src/changeStrategies.js](src/changeStrategies.js) to add new strategies:

```javascript
export function selectStrategy(changeCents, config = {}) {
  const { randomDivisor = 3, enableRandom = true } = config;

  // Add your custom logic here
  if (changeCents > 500) {
    return calculateLargeAmountStrategy;
  }

  if (enableRandom && changeCents % randomDivisor === 0) {
    return calculateRandomChange;
  }

  return calculateMinimumChange;
}
```

### Changing the Random Divisor

The default divisor is 3. You can change it via command-line:

```bash
node src/index.js input.txt output.txt --random-divisor=5
```

Or modify the default in the code if needed.

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

- What might happen if the client needs to change the random divisor?
- What might happen if the client needs to add another special case (like the random twist)?
- What might happen if sales closes a new client in France?

## Design Decisions

### Modular Architecture

The application follows the **Single Responsibility Principle**, with each module handling a specific concern:

- Configuration management
- Strategy selection
- Business logic
- File I/O
- Utilities

### Strategy Pattern

The change calculation uses the **Strategy Pattern**, making it easy to add new calculation methods without modifying existing code.

### Decimal Arithmetic

All calculations are performed in **cents** (integers) to avoid floating-point precision issues common in financial applications.

### Testability

Pure functions and dependency injection make the code highly testable, with comprehensive unit tests covering edge cases.

## Dependencies

### Runtime Dependencies

- None (uses only Node.js built-in modules)

### Development Dependencies

- **jest**: Testing framework for unit tests
  - Version: ^29.7.0
  - Used for running comprehensive test suites with coverage reports

## Troubleshooting

### Common Issues

**Problem**: `Error: ENOENT: no such file or directory`

- **Solution**: Ensure the input file path is correct and the file exists

**Problem**: Tests fail with `Cannot find module`

- **Solution**: Run `npm install` to install dependencies

**Problem**: `Invalid line format` error

- **Solution**: Check that each line in the input file has exactly two comma-separated values

**Problem**: Random output doesn't match expected

- **Solution**: This is normal! The random strategy produces different valid results each time

## License

MIT

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting changes:

```bash
npm test
```

## Future Enhancements

Potential improvements for future versions:

- Web API interface
- GUI application
- Support for multiple currencies in a single transaction
- Customizable output formats (JSON, CSV, etc.)
- Performance optimization for large batch files
- Localization support for denomination names
