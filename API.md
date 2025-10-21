# API Reference

## Main Classes

### CashRegister

Main class that handles change calculation and file processing.

#### Constructor
```javascript
new CashRegister(denominations, countryCode)
```

**Parameters**:
- `denominations` (Array, optional): Custom list of denominations
- `countryCode` (String, optional): Country code ('US', 'COLOMBIA', 'MEXICO', 'SPAIN')

#### Methods

##### calculateChange(owed, paid)
Calculates change for a transaction.

**Parameters**:
- `owed` (Number): Amount owed
- `paid` (Number): Amount paid

**Returns**: String with change denominations

**Example**:
```javascript
const cashRegister = new CashRegister();
const change = cashRegister.calculateChange(2.12, 3.00);
// Returns: "3 quarters,1 dime,3 pennies"
```

##### processFile(inputFile, outputFile)
Processes a transaction file.

**Parameters**:
- `inputFile` (String): Input file path
- `outputFile` (String): Output file path

**Example**:
```javascript
cashRegister.processFile('input.txt', 'output.txt');
```

### CashRegisterBuilder

Builder for flexible CashRegister configuration.

#### Methods

##### setCountry(countryCode)
Sets the country for denominations.

**Parameters**:
- `countryCode` (String): Country code

**Returns**: this (for chaining)

##### addDenomination(name, value, plural)
Adds a custom denomination.

**Parameters**:
- `name` (String): Singular name
- `value` (Number): Value in cents
- `plural` (String): Plural name

**Returns**: this (for chaining)

##### removeDenomination(name)
Removes a denomination.

**Parameters**:
- `name` (String): Name of denomination to remove

**Returns**: this (for chaining)

##### build()
Builds the CashRegister instance.

**Returns**: CashRegister

**Example**:
```javascript
const cashRegister = new CashRegisterBuilder()
  .setCountry('COLOMBIA')
  .addDenomination('half-dollar', 50, 'half-dollars')
  .removeDenomination('penny')
  .build();
```

### DenominationsFactory

Factory for managing country configurations.

#### Static Methods

##### getDenominations(countryCode)
Gets a country's configuration.

**Parameters**:
- `countryCode` (String): Country code

**Returns**: Object with currency, symbol and denominations

##### getSupportedCountries()
Gets the list of supported countries.

**Returns**: Array of country codes

##### addCountry(countryCode, currency, symbol, denominations)
Adds a new country.

**Parameters**:
- `countryCode` (String): Country code
- `currency` (String): Currency code
- `symbol` (String): Currency symbol
- `denominations` (Array): List of denominations

### Validator

Utility for input validation.

#### Static Methods

##### validateAmount(amount, fieldName)
Validates a monetary amount.

**Parameters**:
- `amount` (Number): Amount to validate
- `fieldName` (String): Field name for error messages

##### validateTransaction(owed, paid)
Validates a complete transaction.

**Parameters**:
- `owed` (Number): Amount owed
- `paid` (Number): Amount paid

##### validateCountry(countryCode)
Validates a country code.

**Parameters**:
- `countryCode` (String): Country code

## Change Strategies

### MinimumChangeStrategy
Greedy algorithm that minimizes the number of denominations.

### RandomChangeStrategy
Random algorithm that generates varied but mathematically correct combinations.

## Supported Countries

| Code | Country | Currency | Symbol |
|------|---------|----------|--------|
| US | United States | USD | $ |
| COLOMBIA | Colombia | COP | $ |
| MEXICO | Mexico | MXN | $ |
| SPAIN | Spain | EUR | € |

## File Formats

### Input
```
amount_owed,amount_paid
2.12,3.00
1.97,2.00
3.33,5.00
```

### Output
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,2 quarters,1 dime,1 nickel,2 pennies
```