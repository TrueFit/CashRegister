# Usage Examples

## Basic Examples

### 1. Simple Usage
```javascript
const { CashRegister } = require('./src/index');

const cashRegister = new CashRegister();
const change = cashRegister.calculateChange(2.12, 3.00);
console.log(change); // "3 quarters,1 dime,3 pennies"
```

### 2. File Processing
```javascript
const { CashRegister } = require('./src/index');

const cashRegister = new CashRegister();
cashRegister.processFile('input.txt', 'output.txt');
```

### 3. Country Configuration
```javascript
const { CashRegisterBuilder } = require('./src/index');

const cashRegister = new CashRegisterBuilder()
  .setCountry('COLOMBIA')
  .build();

const change = cashRegister.calculateChange(15000, 20000);
console.log(change); // "1 billete de 5000"
```

## Advanced Examples

### 4. Custom Denominations
```javascript
const { CashRegisterBuilder } = require('./src/index');

const cashRegister = new CashRegisterBuilder()
  .addDenomination('half-dollar', 50, 'half-dollars')
  .removeDenomination('penny')
  .build();

const change = cashRegister.calculateChange(2.00, 3.00);
console.log(change); // "1 dollar,2 half-dollars"
```

### 5. Multiple Countries
```javascript
const { CashRegisterBuilder } = require('./src/index');

// United States
const usCashRegister = new CashRegisterBuilder()
  .setCountry('US')
  .build();

// Colombia
const colCashRegister = new CashRegisterBuilder()
  .setCountry('COLOMBIA')
  .build();

// Mexico
const mexCashRegister = new CashRegisterBuilder()
  .setCountry('MEXICO')
  .build();

console.log(usCashRegister.currency);  // "USD"
console.log(colCashRegister.currency); // "COP"
console.log(mexCashRegister.currency); // "MXN"
```

### 6. Error Handling
```javascript
const { CashRegister } = require('./src/index');
const Validator = require('./src/core/validator');

try {
  const cashRegister = new CashRegister();
  const change = cashRegister.calculateChange(5.00, 3.00);
} catch (error) {
  console.error('Error:', error.message);
  // "Error calculating change: Amount paid cannot be less than amount owed"
}
```

## File Examples

### Input File (input.txt)
```
2.12,3.00
1.97,2.00
3.33,5.00
```

### Output File (output.txt)
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,2 quarters,1 dime,1 nickel,2 pennies
```

### Input File for Colombia (input_colombia.txt)
```
15000,20000
2500,5000
12000,15000
```

### Output File for Colombia (output_colombia.txt)
```
1 billete de 5000
1 billete de 2000,1 moneda de 500
1 billete de 2000,1 moneda de 1000
```

## Testing Examples

### Basic Test
```javascript
const { CashRegister } = require('./src/index');

function testBasicChange() {
  const cashRegister = new CashRegister();
  const change = cashRegister.calculateChange(2.12, 3.00);
  
  if (!change || change === '') {
    throw new Error('Change not calculated');
  }
  
  console.log('✅ Basic test passed');
}

testBasicChange();
```

### Country Test
```javascript
const { CashRegisterBuilder } = require('./src/index');

function testCountry() {
  const cashRegister = new CashRegisterBuilder()
    .setCountry('COLOMBIA')
    .build();
  
  if (cashRegister.currency !== 'COP') {
    throw new Error('Incorrect currency for Colombia');
  }
  
  console.log('✅ Country test passed');
}

testCountry();
```

## Validation Examples

### Amount Validation
```javascript
const Validator = require('./src/core/validator');

// Valid amount
Validator.validateAmount(10.50, 'test');

// Invalid amount
try {
  Validator.validateAmount(-5, 'test');
} catch (error) {
  console.log('Expected error:', error.message);
}
```

### Transaction Validation
```javascript
const Validator = require('./src/core/validator');

// Valid transaction
Validator.validateTransaction(10.50, 15.00);

// Invalid transaction
try {
  Validator.validateTransaction(15.00, 10.50);
} catch (error) {
  console.log('Expected error:', error.message);
}
```

## Strategy Examples

### Minimum Change
```javascript
const MinimumChangeStrategy = require('./src/strategies/minimumChangeStrategy');

const strategy = new MinimumChangeStrategy();
const change = strategy.calculate(88, [
  { name: 'quarter', value: 25, plural: 'quarters' },
  { name: 'dime', value: 10, plural: 'dimes' },
  { name: 'nickel', value: 5, plural: 'nickels' },
  { name: 'penny', value: 1, plural: 'pennies' }
]);

console.log(change); // "3 quarters,1 dime,3 pennies"
```

### Random Change
```javascript
const RandomChangeStrategy = require('./src/strategies/randomChangeStrategy');

const strategy = new RandomChangeStrategy();
const change = strategy.calculate(90, [
  { name: 'dollar', value: 100, plural: 'dollars' },
  { name: 'quarter', value: 25, plural: 'quarters' },
  { name: 'dime', value: 10, plural: 'dimes' },
  { name: 'nickel', value: 5, plural: 'nickels' },
  { name: 'penny', value: 1, plural: 'pennies' }
]);

console.log(change); // Random but correct result
```

## Command Line Examples

### Basic Processing
```bash
node src/index.js input.txt output.txt
```

### With Custom Output File
```bash
node src/index.js input.txt my_output.txt
```

### Run Tests
```bash
node tests/cashRegister.test.js
```

### Run Demonstration
```bash
node demo.js
```

## Real-World Use Cases

### Convenience Store
```javascript
// Process daily transactions
const cashRegister = new CashRegisterBuilder()
  .setCountry('US')
  .build();

cashRegister.processFile('daily_transactions.txt', 'daily_change.txt');
```

### Restaurant in Colombia
```javascript
// Calculate change for waiters
const cashRegister = new CashRegisterBuilder()
  .setCountry('COLOMBIA')
  .build();

const change = cashRegister.calculateChange(25000, 30000);
console.log(`Change: ${change}`); // "1 billete de 5000"
```

### Multi-Country System
```javascript
// Process transactions from different countries
const countries = ['US', 'COLOMBIA', 'MEXICO', 'SPAIN'];

countries.forEach(country => {
  const cashRegister = new CashRegisterBuilder()
    .setCountry(country)
    .build();
  
  cashRegister.processFile(
    `input_${country.toLowerCase()}.txt`,
    `output_${country.toLowerCase()}.txt`
  );
});
```