// Validation module for Cash Register
function Validator() {}

// Validate monetary amount
Validator.validateAmount = function(amount, fieldName = 'amount') {
  if (amount === null || amount === undefined) {
    throw new Error(`${fieldName} cannot be null or undefined`);
  }
  
  if (typeof amount !== 'number') {
    throw new Error(`${fieldName} must be a number`);
  }
  
  if (isNaN(amount)) {
    throw new Error(`${fieldName} is not a valid number`);
  }
  
  if (amount < 0) {
    throw new Error(`${fieldName} cannot be negative`);
  }
  
  if (!isFinite(amount)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  
  // Validate no more than 2 decimal places
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    throw new Error(`${fieldName} cannot have more than 2 decimal places`);
  }
  
  return true;
};

// Validate complete transaction
Validator.validateTransaction = function(owed, paid) {
  Validator.validateAmount(owed, 'Amount owed');
  Validator.validateAmount(paid, 'Amount paid');
  
  if (paid < owed) {
    throw new Error('Amount paid cannot be less than amount owed');
  }
  
  return true;
};

// Validate input file
Validator.validateInputFile = function(filePath) {
  const fs = require('fs');
  
  if (!filePath) {
    throw new Error('File path not specified');
  }
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    throw new Error('Specified path is not a file');
  }
  
  if (stats.size === 0) {
    throw new Error('File is empty');
  }
  
  if (stats.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('File is too large (maximum 10MB)');
  }
  
  return true;
};

// Validate transaction line
Validator.validateTransactionLine = function(line, lineNumber) {
  if (!line || typeof line !== 'string') {
    throw new Error(`Line ${lineNumber}: Invalid content`);
  }
  
  const trimmedLine = line.trim();
  if (trimmedLine === '') {
    throw new Error(`Line ${lineNumber}: Empty line`);
  }
  
  const parts = trimmedLine.split(',');
  if (parts.length !== 2) {
    throw new Error(`Line ${lineNumber}: Invalid format. Must be: amount_owed,amount_paid`);
  }
  
  const [owedStr, paidStr] = parts.map(s => s.trim());
  
  if (!owedStr || !paidStr) {
    throw new Error(`Line ${lineNumber}: Empty values`);
  }
  
  const owed = parseFloat(owedStr);
  const paid = parseFloat(paidStr);
  
  if (isNaN(owed) || isNaN(paid)) {
    throw new Error(`Line ${lineNumber}: Non-numeric values`);
  }
  
  Validator.validateTransaction(owed, paid);
  
  return { owed, paid };
};

// Validate country
Validator.validateCountry = function(countryCode) {
  if (!countryCode) {
    throw new Error('Country code not specified');
  }
  
  if (typeof countryCode !== 'string') {
    throw new Error('Country code must be a string');
  }
  
  const { DenominationsFactory } = require('./denominations');
  const supportedCountries = DenominationsFactory.getSupportedCountries();
  
  if (!supportedCountries.includes(countryCode.toUpperCase())) {
    throw new Error(`Country not supported: ${countryCode}. Available countries: ${supportedCountries.join(', ')}`);
  }
  
  return true;
};

module.exports = Validator;
