#!/usr/bin/env node

const readline = require('readline');
const { spawn } = require('child_process');

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

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Show main menu
async function showMainMenu() {
  console.clear();
  console.log(colorize('🎯 CASH REGISTER INTERACTIVE LAUNCHER', 'cyan'));
  console.log(colorize('=====================================', 'cyan'));
  console.log();
  console.log('Choose your preferred interactive mode:');
  console.log();
  console.log(colorize('1.', 'yellow') + ' Terminal Interactive Mode');
  console.log('   • Command-line interface with menus');
  console.log('   • Single change calculation');
  console.log('   • File processing');
  console.log('   • Multi-country testing');
  console.log('   • Demo scenarios');
  console.log();
  console.log(colorize('2.', 'yellow') + ' Web Interface');
  console.log('   • Beautiful web interface');
  console.log('   • Real-time calculations');
  console.log('   • File upload and processing');
  console.log('   • Visual country selection');
  console.log('   • Batch testing');
  console.log();
  console.log(colorize('3.', 'yellow') + ' Quick Demo');
  console.log('   • Run predefined scenarios');
  console.log('   • Show all features quickly');
  console.log('   • No user interaction needed');
  console.log();
  console.log(colorize('4.', 'yellow') + ' Run Tests');
  console.log('   • Execute test suite');
  console.log('   • Validate all functionality');
  console.log();
  console.log(colorize('0.', 'red') + ' Exit');
  console.log();
}

// Launch terminal interactive mode
function launchTerminalMode() {
  console.log(colorize('🚀 Starting Terminal Interactive Mode...', 'green'));
  console.log();
  
  const child = spawn('node', ['interactive.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(colorize('\n✅ Terminal mode completed successfully', 'green'));
    } else {
      console.log(colorize(`\n❌ Terminal mode exited with code ${code}`, 'red'));
    }
    rl.close();
  });

  child.on('error', (err) => {
    console.log(colorize(`\n❌ Error starting terminal mode: ${err.message}`, 'red'));
    rl.close();
  });
}

// Launch web interface
function launchWebMode() {
  console.log(colorize('🌐 Starting Web Interface...', 'green'));
  console.log();
  
  const child = spawn('node', ['web-server.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(colorize('\n✅ Web server stopped successfully', 'green'));
    } else {
      console.log(colorize(`\n❌ Web server exited with code ${code}`, 'red'));
    }
    rl.close();
  });

  child.on('error', (err) => {
    console.log(colorize(`\n❌ Error starting web server: ${err.message}`, 'red'));
    rl.close();
  });

  // Give the server a moment to start
  setTimeout(() => {
    console.log(colorize('\n🌐 Web Interface is ready!', 'cyan'));
    console.log(colorize('📱 Open your browser and go to: http://localhost:3000', 'yellow'));
    console.log(colorize('💡 Press Ctrl+C to stop the web server', 'blue'));
  }, 2000);
}

// Launch quick demo
async function launchQuickDemo() {
  console.log(colorize('🎬 Running Quick Demo...', 'green'));
  console.log();
  
  const child = spawn('node', ['test_demo.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(colorize('\n✅ Quick demo completed successfully', 'green'));
    } else {
      console.log(colorize(`\n❌ Quick demo exited with code ${code}`, 'red'));
    }
    rl.close();
  });

  child.on('error', (err) => {
    console.log(colorize(`\n❌ Error running quick demo: ${err.message}`, 'red'));
    rl.close();
  });
}

// Launch tests
async function launchTests() {
  console.log(colorize('🧪 Running Test Suite...', 'green'));
  console.log();
  
  const child = spawn('node', ['tests/cashRegister.test.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(colorize('\n✅ All tests passed successfully', 'green'));
    } else {
      console.log(colorize(`\n❌ Tests failed with code ${code}`, 'red'));
    }
    rl.close();
  });

  child.on('error', (err) => {
    console.log(colorize(`\n❌ Error running tests: ${err.message}`, 'red'));
    rl.close();
  });
}

// Main application loop
async function main() {
  console.log(colorize('🚀 Welcome to Cash Register Interactive Launcher!', 'green'));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let running = true;
  
  while (running) {
    await showMainMenu();
    
    const choice = await askQuestion('Enter your choice: ');
    
    switch (choice) {
      case '1':
        launchTerminalMode();
        running = false;
        break;
      case '2':
        launchWebMode();
        running = false;
        break;
      case '3':
        await launchQuickDemo();
        running = false;
        break;
      case '4':
        await launchTests();
        running = false;
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
