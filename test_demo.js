#!/usr/bin/env node

// Simple demo script for testing the Cash Register
const fs = require('fs');
const CashRegister = require('./src/core/cashRegister');
const CashRegisterBuilder = require('./src/patterns/cashRegisterBuilder');

console.log('🎯 CASH REGISTER DEMO');
console.log('====================\n');

// Test 1: Basic functionality
console.log('📝 Test 1: Basic Change Calculation');
console.log('-----------------------------------');

const cashRegister = new CashRegisterBuilder().build();

// Test cases from the original problem
const testCases = [
  { owed: 2.12, paid: 3.00, description: 'Normal change (minimum denominations)' },
  { owed: 1.97, paid: 2.00, description: 'Small change' },
  { owed: 3.33, paid: 5.00, description: 'Random change (divisible by 3)' },
  { owed: 5.00, paid: 5.00, description: 'No change needed' }
];

testCases.forEach((testCase, index) => {
  try {
    const change = cashRegister.calculateChange(testCase.owed, testCase.paid);
    console.log(`${index + 1}. ${testCase.description}`);
    console.log(`   Input: $${testCase.owed} owed, $${testCase.paid} paid`);
    console.log(`   Output: ${change}\n`);
  } catch (error) {
    console.log(`${index + 1}. ${testCase.description}`);
    console.log(`   Error: ${error.message}\n`);
  }
});

// Test 2: File processing
console.log('📁 Test 2: File Processing');
console.log('-------------------------');

try {
  // Create a test file
  const testInput = `2.12,3.00
1.97,2.00
3.33,5.00
5.00,5.00`;

  fs.writeFileSync('demo_input.txt', testInput);
  console.log('✅ Created demo_input.txt');
  
  // Process the file
  cashRegister.processFile('demo_input.txt', 'demo_output.txt');
  
  // Show results
  const output = fs.readFileSync('demo_output.txt', 'utf8');
  console.log('✅ Generated demo_output.txt');
  console.log('\n📄 Output file contents:');
  console.log(output);
  
  // Clean up
  fs.unlinkSync('demo_input.txt');
  fs.unlinkSync('demo_output.txt');
  console.log('\n🧹 Cleaned up demo files');
  
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

// Test 3: Multi-country support
console.log('\n🌍 Test 3: Multi-Country Support');
console.log('--------------------------------');

const countries = ['US', 'COLOMBIA', 'MEXICO', 'SPAIN'];

countries.forEach(country => {
  try {
    const countryCashRegister = new CashRegisterBuilder().setCountry(country).build();
    const change = countryCashRegister.calculateChange(10.50, 15.00);
    console.log(`${country}: ${change}`);
  } catch (error) {
    console.log(`${country}: Error - ${error.message}`);
  }
});

console.log('\n🎉 Demo completed!');
console.log('\n💡 To run your own tests:');
console.log('   node src/index.js input.txt output.txt');
console.log('   node tests/cashRegister.test.js');
