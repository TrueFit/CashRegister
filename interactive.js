#!/usr/bin/env node

const readline = require('readline');
const CashRegister = require('./src/core/cashRegister');
const CashRegisterBuilder = require('./src/patterns/cashRegisterBuilder');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for better UX
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to colorize text
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Main interactive menu
async function showMainMenu() {
  console.clear();
  console.log(colorize('🎯 CASH REGISTER INTERACTIVE MODE', 'cyan'));
  console.log(colorize('================================', 'cyan'));
  console.log();
  console.log('Choose an option:');
  console.log(colorize('1.', 'yellow') + ' Calculate single change');
  console.log(colorize('2.', 'yellow') + ' Process file');
  console.log(colorize('3.', 'yellow') + ' Test different countries');
  console.log(colorize('4.', 'yellow') + ' Run demo scenarios');
  console.log(colorize('5.', 'yellow') + ' Show help');
  console.log(colorize('0.', 'red') + ' Exit');
  console.log();
}

// Single change calculation
async function calculateSingleChange() {
  console.clear();
  console.log(colorize('💰 SINGLE CHANGE CALCULATION', 'green'));
  console.log(colorize('============================', 'green'));
  console.log();

  try {
    const owed = await askQuestion('Enter amount owed: $');
    const paid = await askQuestion('Enter amount paid: $');
    
    const cashRegister = new CashRegisterBuilder().build();
    const change = cashRegister.calculateChange(parseFloat(owed), parseFloat(paid));
    
    console.log();
    console.log(colorize('📊 RESULT:', 'bright'));
    console.log(colorize(`Change: ${change}`, 'green'));
    
    // Show if it's random change
    const changeInCents = Math.round((parseFloat(paid) - parseFloat(owed)) * 100);
    if (changeInCents % 3 === 0 && changeInCents > 0) {
      console.log(colorize('🎲 This is RANDOM change (amount divisible by 3)', 'magenta'));
    } else if (changeInCents > 0) {
      console.log(colorize('📐 This is MINIMUM change (greedy algorithm)', 'blue'));
    }
    
  } catch (error) {
    console.log(colorize(`❌ Error: ${error.message}`, 'red'));
  }
  
  await askQuestion('\nPress Enter to continue...');
}

// File processing
async function processFile() {
  console.clear();
  console.log(colorize('📁 FILE PROCESSING', 'green'));
  console.log(colorize('==================', 'green'));
  console.log();

  try {
    const inputFile = await askQuestion('Enter input file path: ');
    const outputFile = await askQuestion('Enter output file path (or press Enter for "output.txt"): ') || 'output.txt';
    
    const cashRegister = new CashRegisterBuilder().build();
    cashRegister.processFile(inputFile, outputFile);
    
    console.log();
    console.log(colorize('✅ File processed successfully!', 'green'));
    console.log(colorize(`📄 Output saved to: ${outputFile}`, 'blue'));
    
    // Ask if user wants to see the output
    const showOutput = await askQuestion('\nDo you want to see the output? (y/n): ');
    if (showOutput.toLowerCase() === 'y' || showOutput.toLowerCase() === 'yes') {
      const fs = require('fs');
      const output = fs.readFileSync(outputFile, 'utf8');
      console.log('\n📄 Output content:');
      console.log(colorize(output, 'cyan'));
    }
    
  } catch (error) {
    console.log(colorize(`❌ Error: ${error.message}`, 'red'));
  }
  
  await askQuestion('\nPress Enter to continue...');
}

// Test different countries
async function testCountries() {
  console.clear();
  console.log(colorize('🌍 COUNTRY TESTING', 'green'));
  console.log(colorize('==================', 'green'));
  console.log();

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'COLOMBIA', name: 'Colombia' },
    { code: 'MEXICO', name: 'Mexico' },
    { code: 'SPAIN', name: 'Spain' }
  ];

  console.log('Available countries:');
  countries.forEach((country, index) => {
    console.log(colorize(`${index + 1}.`, 'yellow') + ` ${country.name} (${country.code})`);
  });
  console.log();

  try {
    const choice = await askQuestion('Select country (1-4): ');
    const countryIndex = parseInt(choice) - 1;
    
    if (countryIndex < 0 || countryIndex >= countries.length) {
      throw new Error('Invalid country selection');
    }
    
    const selectedCountry = countries[countryIndex];
    console.log();
    console.log(colorize(`Testing with ${selectedCountry.name} denominations:`, 'blue'));
    
    const cashRegister = new CashRegisterBuilder().setCountry(selectedCountry.code).build();
    
    // Test with a sample amount
    const testAmount = 10.50;
    const paidAmount = 15.00;
    const change = cashRegister.calculateChange(testAmount, paidAmount);
    
    console.log(colorize(`Test: $${testAmount} owed, $${paidAmount} paid`, 'cyan'));
    console.log(colorize(`Change: ${change}`, 'green'));
    
  } catch (error) {
    console.log(colorize(`❌ Error: ${error.message}`, 'red'));
  }
  
  await askQuestion('\nPress Enter to continue...');
}

// Demo scenarios
async function runDemoScenarios() {
  console.clear();
  console.log(colorize('🎬 DEMO SCENARIOS', 'green'));
  console.log(colorize('=================', 'green'));
  console.log();

  const scenarios = [
    {
      name: 'Normal Change (Minimum)',
      owed: 2.12,
      paid: 3.00,
      description: 'Standard change calculation using minimum denominations'
    },
    {
      name: 'Small Change',
      owed: 1.97,
      paid: 2.00,
      description: 'Very small change amount'
    },
    {
      name: 'Random Change (Special)',
      owed: 3.33,
      paid: 5.00,
      description: 'Random denominations because change is divisible by 3'
    },
    {
      name: 'No Change',
      owed: 5.00,
      paid: 5.00,
      description: 'Exact payment, no change needed'
    },
    {
      name: 'Large Amount',
      owed: 99.99,
      paid: 100.00,
      description: 'Large amount with small change'
    }
  ];

  const cashRegister = new CashRegisterBuilder().build();

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(colorize(`${i + 1}. ${scenario.name}`, 'yellow'));
    console.log(`   ${scenario.description}`);
    console.log(`   Input: $${scenario.owed} owed, $${scenario.paid} paid`);
    
    try {
      const change = cashRegister.calculateChange(scenario.owed, scenario.paid);
      console.log(colorize(`   Output: ${change}`, 'green'));
      
      // Show change type
      const changeInCents = Math.round((scenario.paid - scenario.owed) * 100);
      if (changeInCents % 3 === 0 && changeInCents > 0) {
        console.log(colorize('   🎲 Random change (divisible by 3)', 'magenta'));
      } else if (changeInCents > 0) {
        console.log(colorize('   📐 Minimum change (greedy)', 'blue'));
      }
      
    } catch (error) {
      console.log(colorize(`   ❌ Error: ${error.message}`, 'red'));
    }
    
    console.log();
    
    if (i < scenarios.length - 1) {
      await askQuestion('Press Enter for next scenario...');
    }
  }
  
  await askQuestion('\nPress Enter to continue...');
}

// Show help
async function showHelp() {
  console.clear();
  console.log(colorize('❓ HELP & INFORMATION', 'cyan'));
  console.log(colorize('======================', 'cyan'));
  console.log();
  
  console.log(colorize('🎯 How it works:', 'yellow'));
  console.log('• Normal change: Returns minimum denominations (greedy algorithm)');
  console.log('• Special case: If change amount is divisible by 3, returns random denominations');
  console.log('• Math is always correct: The sum always equals the exact change needed');
  console.log();
  
  console.log(colorize('📝 Input file format:', 'yellow'));
  console.log('Each line should contain: amount_owed,amount_paid');
  console.log('Example:');
  console.log('  2.12,3.00');
  console.log('  1.97,2.00');
  console.log('  3.33,5.00');
  console.log();
  
  console.log(colorize('🌍 Supported countries:', 'yellow'));
  console.log('• US - United States (dollars, quarters, dimes, nickels, pennies)');
  console.log('• COLOMBIA - Colombia (pesos, bills and coins)');
  console.log('• MEXICO - Mexico (pesos, bills and coins)');
  console.log('• SPAIN - Spain (euros, bills and coins)');
  console.log();
  
  console.log(colorize('🎲 Random change examples:', 'yellow'));
  console.log('• Change of 87 cents → Random (87 ÷ 3 = 29)');
  console.log('• Change of 90 cents → Random (90 ÷ 3 = 30)');
  console.log('• Change of 88 cents → Normal (88 ÷ 3 = 29.33)');
  console.log();
  
  console.log(colorize('📚 More documentation:', 'yellow'));
  console.log('• README.md - Main documentation');
  console.log('• QUICK_START.md - Quick start guide');
  console.log('• HOW_TO_TEST.md - Testing guide');
  console.log('• API.md - API reference');
  console.log('• EXAMPLES.md - Usage examples');
  
  await askQuestion('\nPress Enter to continue...');
}

// Main application loop
async function main() {
  console.log(colorize('🚀 Starting Cash Register Interactive Mode...', 'green'));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let running = true;
  
  while (running) {
    await showMainMenu();
    
    const choice = await askQuestion('Enter your choice: ');
    
    switch (choice) {
      case '1':
        await calculateSingleChange();
        break;
      case '2':
        await processFile();
        break;
      case '3':
        await testCountries();
        break;
      case '4':
        await runDemoScenarios();
        break;
      case '5':
        await showHelp();
        break;
      case '0':
        console.log(colorize('\n👋 Thanks for using Cash Register! Goodbye!', 'green'));
        running = false;
        break;
      default:
        console.log(colorize('\n❌ Invalid choice. Please try again.', 'red'));
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(colorize('\n\n👋 Goodbye!', 'green'));
  rl.close();
  process.exit(0);
});

// Start the application
if (require.main === module) {
  main().catch(error => {
    console.error(colorize(`❌ Fatal error: ${error.message}`, 'red'));
    rl.close();
    process.exit(1);
  });
}

module.exports = { main };
