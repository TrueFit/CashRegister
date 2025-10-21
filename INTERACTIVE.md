# 🎯 Interactive Features

The Cash Register now includes multiple interactive modes to make testing and demonstration easier!

## 🚀 Interactive Launcher

**Start with:** `node start-interactive.js`

This launcher provides a menu to choose between different interactive modes:

### 1. Terminal Interactive Mode
- **Command:** `node interactive.js`
- **Features:**
  - Menu-driven interface
  - Single change calculation
  - File processing
  - Multi-country testing
  - Demo scenarios
  - Help system
- **Best for:** Developers, command-line users

### 2. Web Interface
- **Command:** `node web-server.js`
- **URL:** http://localhost:3000
- **Features:**
  - Beautiful web interface
  - Real-time calculations
  - File upload and processing
  - Visual country selection
  - Batch testing
  - Responsive design
- **Best for:** Demos, presentations, non-technical users

### 3. Quick Demo
- **Command:** `node test_demo.js`
- **Features:**
  - Predefined scenarios
  - Shows all features quickly
  - No user interaction needed
  - Perfect for presentations
- **Best for:** Quick demonstrations, automated testing

### 4. Run Tests
- **Command:** `node tests/cashRegister.test.js`
- **Features:**
  - Comprehensive test suite
  - Validation of all functionality
  - Error handling tests
  - Multi-country tests
- **Best for:** Development, quality assurance

## 🌐 Web Interface Features

### Single Change Calculation
- Enter amounts owed and paid
- Real-time calculation
- Visual feedback for change type (minimum vs random)
- Error handling with clear messages

### Country Selection
- Visual country selector
- Real-time denomination updates
- Support for US, Colombia, Mexico, Spain
- Currency symbols and names

### Demo Scenarios
- Predefined test cases
- One-click execution
- Explanations for each scenario
- Visual change type indicators

### File Processing
- Drag-and-drop file upload
- CSV format support
- Real-time processing
- Download sample files
- Results display

### Batch Testing
- Test multiple scenarios at once
- Country comparison
- Comprehensive results
- Export capabilities

## 💻 Terminal Interactive Features

### Main Menu
- Easy navigation
- Color-coded options
- Clear descriptions
- Help system

### Single Change Calculation
- Input validation
- Real-time feedback
- Change type indicators
- Error handling

### File Processing
- File validation
- Progress indicators
- Results summary
- Error reporting

### Multi-Country Testing
- Country selection menu
- Sample calculations
- Denomination display
- Error handling

### Demo Scenarios
- Step-by-step execution
- Explanations
- Pause between scenarios
- Results display

## 🎬 Quick Demo Scenarios

The quick demo (`test_demo.js`) includes:

1. **Normal Change (Minimum)**
   - Input: $2.12 owed, $3.00 paid
   - Output: 3 quarters,1 dime,3 pennies
   - Type: Minimum denominations

2. **Small Change**
   - Input: $1.97 owed, $2.00 paid
   - Output: 3 pennies
   - Type: Very small change

3. **Random Change (Special)**
   - Input: $3.33 owed, $5.00 paid
   - Output: Random denominations
   - Type: Divisible by 3

4. **No Change**
   - Input: $5.00 owed, $5.00 paid
   - Output: No change needed
   - Type: Exact payment

5. **Multi-Country Support**
   - Tests all supported countries
   - Shows different denominations
   - Validates functionality

## 🔧 Technical Details

### Web Interface
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js HTTP server
- **Port:** 3000 (configurable)
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

### Terminal Interface
- **Library:** Node.js readline
- **Colors:** ANSI color codes
- **Input:** Keyboard navigation
- **Output:** Formatted console output

### File Processing
- **Formats:** .txt, .csv
- **Validation:** Input format checking
- **Error Handling:** Line-by-line error reporting
- **Output:** Formatted results

## 🚀 Getting Started

### Option 1: Interactive Launcher (Recommended)
```bash
node start-interactive.js
```
Choose your preferred mode from the menu.

### Option 2: Direct Access
```bash
# Terminal mode
node interactive.js

# Web mode
node web-server.js
# Then open http://localhost:3000

# Quick demo
node test_demo.js

# Tests
node tests/cashRegister.test.js
```

### Option 3: Command Line
```bash
# Basic usage
node src/index.js input.txt output.txt

# With different country
node demo.js colombia
```

## 🎯 Use Cases

### For Developers
- **Terminal Interactive Mode**: Full control, debugging, testing
- **Tests**: Validation, quality assurance
- **Command Line**: Integration, automation

### For Demos/Presentations
- **Web Interface**: Visual, user-friendly, impressive
- **Quick Demo**: Fast, automated, comprehensive
- **Interactive Launcher**: Professional, organized

### For End Users
- **Web Interface**: Easy to use, no technical knowledge required
- **Quick Demo**: See all features quickly
- **Terminal Mode**: Advanced users, power users

## 🔍 Troubleshooting

### Web Interface Issues
- **Port 3000 in use**: Change port in `web-server.js`
- **File upload fails**: Check file format (CSV with comma separation)
- **Browser compatibility**: Use modern browsers

### Terminal Interface Issues
- **Colors not showing**: Check terminal color support
- **Input not working**: Ensure proper terminal setup
- **File not found**: Check file paths and permissions

### General Issues
- **Node.js version**: Requires Node.js 12 or higher
- **File permissions**: Ensure scripts are executable
- **Dependencies**: No external dependencies required

## 📚 Related Documentation

- [README.md](README.md) - Main documentation
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [HOW_TO_TEST.md](HOW_TO_TEST.md) - Testing guide
- [API.md](API.md) - API reference
- [EXAMPLES.md](EXAMPLES.md) - Usage examples
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide

---

**🎉 Enjoy the interactive Cash Register experience!**
