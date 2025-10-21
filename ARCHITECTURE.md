# System Architecture

## Overview

The Cash Register is a modular system that calculates monetary change using multiple design patterns. It's designed to be extensible, maintainable, and support multiple countries with their respective denominations.

## Implemented Design Patterns

### 1. Strategy Pattern
**Location**: `src/strategies/`

- **`changeStrategy.js`**: Base interface for calculation strategies
- **`minimumChangeStrategy.js`**: Greedy algorithm for minimum change
- **`randomChangeStrategy.js`**: Random algorithm for special cases

**Advantages**:
- Easy to add new calculation strategies
- Clear separation of algorithms
- Dynamic strategy switching

### 2. Factory Pattern
**Location**: `src/patterns/changeStrategyFactory.js`

- Automatically selects the correct strategy
- Encapsulates decision logic
- Facilitates business rule maintenance

### 3. Builder Pattern
**Location**: `src/patterns/cashRegisterBuilder.js`

- Flexible CashRegister configuration
- Chainable methods for configuration
- Support for custom denominations

### 4. Template Method Pattern
**Location**: `src/core/cashRegister.js`

- Defines common processing flow
- Methods: `processFile()` → `readTransactions()` → `processTransactions()` → `writeResults()`
- Consistent and reusable structure

## Directory Structure

```
src/
├── core/                    # Main business logic
│   ├── cashRegister.js     # Main class
│   ├── denominations.js    # Country configurations
│   └── validator.js        # Robust validation
├── strategies/             # Calculation strategies
│   ├── changeStrategy.js
│   ├── minimumChangeStrategy.js
│   └── randomChangeStrategy.js
├── patterns/               # Design patterns
│   ├── changeStrategyFactory.js
│   └── cashRegisterBuilder.js
└── index.js               # Entry point
```

## Data Flow

1. **Input**: Text file with transactions
2. **Validation**: Format and value verification
3. **Processing**: Change calculation per transaction
4. **Strategy**: Automatic algorithm selection
5. **Output**: File with change denominations

## Extensibility

### Adding New Country
```javascript
DenominationsFactory.addCountry('AR', 'ARS', '$', [
  { name: 'billete de 1000', value: 100000, plural: 'billetes de 1000' },
  // ... more denominations
]);
```

### Adding New Strategy
```javascript
function CustomChangeStrategy() {
  ChangeStrategy.call(this);
  this.calculate = function(changeInCents, denominations) {
    // Custom logic
  };
}
```

## Design Principles

- **Single Responsibility**: Each class has a specific responsibility
- **Open/Closed**: Open for extension, closed for modification
- **Dependency Inversion**: Depends on abstractions, not concretions
- **Interface Segregation**: Specific and cohesive interfaces