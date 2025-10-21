// Demonstration of modular version with separate files
const { CashRegister, CashRegisterBuilder } = require('./src/index');
const ChangeStrategyFactory = require('./src/patterns/changeStrategyFactory');
const MinimumChangeStrategy = require('./src/strategies/minimumChangeStrategy');
const RandomChangeStrategy = require('./src/strategies/randomChangeStrategy');

console.log('=== MODULAR DESIGN PATTERNS DEMONSTRATION ===\n');

// 1. Strategy Pattern - Use different strategies
console.log('1. STRATEGY PATTERN:');
console.log('-------------------');

const cashRegister = new CashRegister();

// Test normal change (minimum)
console.log('Normal change (2.12 paid with 3.00):');
console.log('Result:', cashRegister.calculateChange(2.12, 3.00));

// Test random change (divisible by 3)
console.log('\nRandom change (3.33 paid with 5.00):');
console.log('Result:', cashRegister.calculateChange(3.33, 5.00));

// 2. Factory Pattern - Create strategies
console.log('\n2. FACTORY PATTERN:');
console.log('------------------');

const strategy1 = ChangeStrategyFactory.createStrategy(88); // Not divisible by 3
const strategy2 = ChangeStrategyFactory.createStrategy(90); // Divisible by 3

console.log('Strategy for 88 cents:', strategy1.constructor.name);
console.log('Strategy for 90 cents:', strategy2.constructor.name);

// 3. Builder Pattern - Configure custom CashRegister
console.log('\n3. BUILDER PATTERN:');
console.log('------------------');

const customCashRegister = new CashRegisterBuilder()
  .addDenomination('half-dollar', 50, 'half-dollars')
  .removeDenomination('penny')
  .build();

console.log('Custom CashRegister created with:');
console.log('- Denominations:', customCashRegister.denominations.map(d => d.name).join(', '));

// Test with custom denominations
console.log('\nTesting with custom denominations (2.00 paid with 3.00):');
console.log('Result:', customCashRegister.calculateChange(2.00, 3.00));

// 4. Template Method Pattern - Processing flow
console.log('\n4. TEMPLATE METHOD PATTERN:');
console.log('---------------------------');

console.log('The processFile() method defines the flow:');
console.log('1. readTransactions() - Reads the file');
console.log('2. processTransactions() - Processes each transaction');
console.log('3. writeResults() - Writes the results');

// 5. Modular structure
console.log('\n5. MODULAR STRUCTURE:');
console.log('----------------------');
console.log('src/');
console.log('├── core/');
console.log('│   ├── cashRegister.js      # Main class');
console.log('│   └── denominations.js     # Configuration');
console.log('├── strategies/');
console.log('│   ├── changeStrategy.js    # Base interface');
console.log('│   ├── minimumChangeStrategy.js');
console.log('│   └── randomChangeStrategy.js');
console.log('├── patterns/');
console.log('│   ├── changeStrategyFactory.js');
console.log('│   └── cashRegisterBuilder.js');
console.log('└── index.js                 # Entry point');

// 6. Advantages of modularization
console.log('\n6. ADVANTAGES OF MODULARIZATION:');
console.log('----------------------------------');
console.log('✓ Clear separation of responsibilities');
console.log('✓ Easy maintenance and testing');
console.log('✓ Component reusability');
console.log('✓ Improved scalability');
console.log('✓ More readable and organized code');
console.log('✓ Single responsibility principle');

console.log('\n=== DEMONSTRATION COMPLETED ===');
