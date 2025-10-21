# Development Guide

## Environment Setup

### Requirements
- Node.js 12+ (compatible with older versions)
- No external dependencies required

### Project Structure
```
CashRegister/
├── src/                    # Source code
├── tests/                  # Unit tests
├── demo.js                # Demonstration
├── input.txt              # Example file
└── README.md              # Main documentation
```

## Execution

### Main Application
```bash
node src/index.js input.txt output.txt
```

### Tests
```bash
node tests/cashRegister.test.js
```

### Demonstration
```bash
node demo.js
```

## Development

### Adding New Strategy

1. Create file in `src/strategies/`:
```javascript
// src/strategies/customChangeStrategy.js
const ChangeStrategy = require('./changeStrategy');

function CustomChangeStrategy() {
  ChangeStrategy.call(this);
  
  this.calculate = function(changeInCents, denominations) {
    // Custom logic
    const result = [];
    // ... implementation
    return result.join(',');
  };
}

module.exports = CustomChangeStrategy;
```

2. Update Factory in `src/patterns/changeStrategyFactory.js`:
```javascript
const CustomChangeStrategy = require('../strategies/customChangeStrategy');

ChangeStrategyFactory.createStrategy = function(changeInCents) {
  if (/* new condition */) {
    return new CustomChangeStrategy();
  }
  // ... rest of logic
};
```

### Adding New Country

1. Update `src/core/denominations.js`:
```javascript
const DENOMINATIONS_BY_COUNTRY = {
  // ... existing countries
  'NEW_COUNTRY': {
    currency: 'XXX',
    symbol: 'X',
    denominations: [
      { name: 'denomination', value: 100, plural: 'denominations' },
      // ... more denominations
    ]
  }
};
```

2. Add tests in `tests/cashRegister.test.js`:
```javascript
test('Cash Register New Country', function() {
  const cashRegister = new CashRegisterBuilder()
    .setCountry('NEW_COUNTRY')
    .build();
  
  if (cashRegister.currency !== 'XXX') {
    throw new Error('Incorrect currency');
  }
});
```

### Adding Validations

1. Extend `src/core/validator.js`:
```javascript
Validator.validateCustomRule = function(value) {
  if (/* condition */) {
    throw new Error('Error message');
  }
  return true;
};
```

2. Use in `src/core/cashRegister.js`:
```javascript
Validator.validateCustomRule(someValue);
```

## Testing

### Test Structure
```javascript
function test(name, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    testsFailed++;
  }
}
```

### Running Tests
```bash
node tests/cashRegister.test.js
```

### Adding New Tests
```javascript
test('New functionality', function() {
  // Arrange
  const input = 'test input';
  
  // Act
  const result = functionToTest(input);
  
  // Assert
  if (result !== expected) {
    throw new Error('Unexpected result');
  }
});
```

## Debugging

### Debug Logs
The system includes informative logs:
- ✅ Successful transactions
- ❌ Transactions with errors
- 📊 Processing statistics

### Input Validation
- Verify file format
- Validate numeric amounts
- Check supported countries

### Common Errors

1. **"Country not supported"**
   - Verify country is in `DENOMINATIONS_BY_COUNTRY`
   - Use uppercase codes

2. **"Invalid numeric values"**
   - Check input format
   - Ensure no non-numeric characters

3. **"File does not exist"**
   - Verify file path
   - Check read permissions

## Best Practices

### Code
- Follow SOLID principles
- Keep functions small and focused
- Use descriptive names
- Document complex functions

### Testing
- One test per functionality
- Success and error cases
- Realistic test data
- Verify error messages

### Validation
- Validate input early
- Clear error messages
- Graceful error handling
- Informative logs

## Contribution

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Run existing tests
6. Create pull request

## Roadmap

### Upcoming Improvements
- [ ] Support for more countries
- [ ] Customizable change strategies
- [ ] External configuration
- [ ] Advanced metrics
- [ ] REST API