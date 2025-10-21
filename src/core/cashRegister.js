const fs = require('fs');
const ChangeStrategyFactory = require('../patterns/changeStrategyFactory');
const { DenominationsFactory } = require('./denominations');
const Validator = require('./validator');

// Main class that uses Strategy Pattern
function CashRegister(denominations, countryCode) {
  if (countryCode) {
    Validator.validateCountry(countryCode);
    const countryConfig = DenominationsFactory.getDenominations(countryCode);
    this.denominations = countryConfig.denominations;
    this.currency = countryConfig.currency;
    this.symbol = countryConfig.symbol;
    this.countryCode = countryCode.toUpperCase();
  } else {
    this.denominations = denominations || require('./denominations').DENOMINATIONS;
    this.currency = 'USD';
    this.symbol = '$';
    this.countryCode = 'US';
  }
}

CashRegister.prototype.calculateChange = function(owed, paid) {
  try {
    // Validate input
    Validator.validateTransaction(owed, paid);
    
    const changeInCents = Math.round((paid - owed) * 100);
    
    if (changeInCents === 0) {
      return 'No change needed';
    }

    // Use Factory to get the correct strategy
    const strategy = ChangeStrategyFactory.createStrategy(changeInCents);
    return strategy.calculate(changeInCents, this.denominations);
  } catch (error) {
    throw new Error(`Error calculating change: ${error.message}`);
  }
};

// Template Method Pattern - Define processing flow
CashRegister.prototype.processFile = function(inputFile, outputFile) {
  try {
    // Validate input file
    Validator.validateInputFile(inputFile);
    
    const transactions = this.readTransactions(inputFile);
    const results = this.processTransactions(transactions);
    this.writeResults(outputFile, results);
    console.log(`✅ Output file generated: ${outputFile}`);
    console.log(`📊 Processed ${transactions.length} transactions`);
  } catch (error) {
    console.error('❌ Error processing file:', error.message);
    throw error;
  }
};

CashRegister.prototype.readTransactions = function(inputFile) {
  const data = fs.readFileSync(inputFile, 'utf-8');
  return data.trim().split('\n').filter(function(line) {
    return line.trim() !== '';
  });
};

CashRegister.prototype.processTransactions = function(transactions) {
  const results = [];
  const self = this;
  let successCount = 0;
  let errorCount = 0;
  
  transactions.forEach(function(line, index) {
    try {
      const transaction = self.parseTransaction(line, index + 1);
      const change = self.calculateChange(transaction.owed, transaction.paid);
      results.push(change);
      successCount++;
    } catch (error) {
      results.push(`❌ Error on line ${index + 1}: ${error.message}`);
      errorCount++;
    }
  });
  
  console.log(`✅ Successful transactions: ${successCount}`);
  if (errorCount > 0) {
    console.log(`❌ Transactions with errors: ${errorCount}`);
  }
  
  return results;
};

CashRegister.prototype.parseTransaction = function(line, lineNumber) {
  try {
    return Validator.validateTransactionLine(line, lineNumber);
  } catch (error) {
    throw new Error(`Line ${lineNumber}: ${error.message}`);
  }
};

CashRegister.prototype.writeResults = function(outputFile, results) {
  fs.writeFileSync(outputFile, results.join('\n'));
};

module.exports = CashRegister;
