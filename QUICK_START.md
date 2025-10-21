# 🚀 Quick Start Guide

## Prerequisites
- Node.js (version 12 or higher)
- No additional dependencies required

## 🎯 START HERE - Interactive Demo

**🚀 Launch the Interactive Launcher:**
```bash
node start-interactive.js
```

**Choose from 4 interactive modes:**
1. **Terminal Interactive Mode** - Full command-line interface
2. **Web Interface** - Beautiful web interface at http://localhost:3000
3. **Quick Demo** - Automated demonstration
4. **Run Tests** - Execute test suite

## 🎯 Alternative: Basic Command Line Test

### Step 1: Basic Test
```bash
# Run with the included sample file
node src/index.js input.txt output.txt
```

### Step 2: Check Results
```bash
# View the output
cat output.txt
```

**Expected Output:**
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,2 quarters,1 dime,1 nickel,2 pennies
```

### Step 3: Test with Your Own Data
1. Create your own input file:
```bash
echo "5.50,10.00" > my_input.txt
echo "2.25,3.00" >> my_input.txt
echo "9.99,20.00" >> my_input.txt
```

2. Run the program:
```bash
node src/index.js my_input.txt my_output.txt
```

3. Check results:
```bash
cat my_output.txt
```

## 🌍 Test Different Countries

### Colombia
```bash
node demo.js colombia
```

### Mexico
```bash
node demo.js mexico
```

### Spain
```bash
node demo.js spain
```

## 🧪 Run Tests
```bash
node tests/cashRegister.test.js
```

## 📝 Input File Format
Each line should contain: `amount_owed,amount_paid`

**Examples:**
```
2.12,3.00
1.97,2.00
3.33,5.00
```

## 🎲 How It Works
- **Normal change**: Returns minimum denominations
- **Special case**: If change amount is divisible by 3, returns random denominations
- **Math is always correct**: The sum always equals the exact change needed

## ❓ Troubleshooting

### Error: "File does not exist"
- Make sure the input file exists
- Check the file path is correct

### Error: "Invalid format"
- Ensure each line has exactly 2 numbers separated by a comma
- Example: `2.50,5.00` ✅
- Example: `2.50,5.00,extra` ❌

### Error: "Amount paid cannot be less than amount owed"
- The paid amount must be greater than or equal to the owed amount
- Example: `5.00,3.00` ❌ (paid less than owed)

## 🎯 Quick Examples

### Example 1: Normal Change
```
Input: 2.12,3.00
Output: 3 quarters,1 dime,3 pennies
```

### Example 2: No Change
```
Input: 5.00,5.00
Output: No change needed
```

### Example 3: Random Change (divisible by 3)
```
Input: 3.33,5.00
Output: 1 dollar,2 quarters,1 dime,1 nickel,2 pennies
(Note: This will be different each time you run it)
```

## 🚀 Advanced Usage

### Custom Denominations
```javascript
const builder = new CashRegisterBuilder();
builder.addDenomination('custom bill', 500, 'custom bills');
const cashRegister = builder.build();
```

### Multi-Country Support
```javascript
const cashRegister = new CashRegisterBuilder()
  .setCountry('COLOMBIA')
  .build();
```

---

**Need help?** Check the full documentation in `README.md`, `API.md`, or `EXAMPLES.md`
