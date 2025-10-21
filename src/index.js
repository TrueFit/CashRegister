#!/usr/bin/env node

const CashRegister = require('./core/cashRegister');
const CashRegisterBuilder = require('./patterns/cashRegisterBuilder');

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node src/index.js <input_file> [output_file]');
    console.log('Example: node src/index.js input.txt output.txt');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || 'output.txt';

  try {
    // Use Builder to create the CashRegister
    const cashRegister = new CashRegisterBuilder().build();
    
    cashRegister.processFile(inputFile, outputFile);
    console.log('Processing completed successfully');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { 
  CashRegister: CashRegister, 
  CashRegisterBuilder: CashRegisterBuilder
};
