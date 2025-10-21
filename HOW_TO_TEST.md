# 🧪 How to Test the Cash Register

## 🚀 START HERE - Interactive Launcher (Recommended)

```bash
# 1. Launch the interactive launcher
node start-interactive.js

# 2. Choose your preferred mode from the menu
#    - Terminal Interactive Mode
#    - Web Interface
#    - Quick Demo
#    - Run Tests
```

## 🚀 Super Quick Test (30 seconds)

```bash
# 1. Run the demo
node test_demo.js

# 2. That's it! You'll see all functionality working
```

## 📋 Step-by-Step Testing

### Option 1: Use Sample Data
```bash
# Run with included sample
node src/index.js input.txt output.txt

# Check results
cat output.txt
```

### Option 2: Create Your Own Test
```bash
# 1. Create your input file
echo "2.50,5.00" > my_test.txt
echo "1.33,2.00" >> my_test.txt

# 2. Run the program
node src/index.js my_test.txt my_result.txt

# 3. Check results
cat my_result.txt
```

### Option 3: Run All Tests
```bash
# Run comprehensive test suite
node tests/cashRegister.test.js
```

## 🎯 What You Should See

### Expected Output for `input.txt`:
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,2 quarters,1 dime,1 nickel,2 pennies
```

### Key Features to Notice:
- ✅ **Line 1**: Normal change (minimum denominations)
- ✅ **Line 2**: Small change (3 pennies)
- ✅ **Line 3**: Random change (divisible by 3) - will vary each run
- ✅ **Math is correct**: All amounts add up perfectly

## 🌍 Test Different Countries

```bash
# Test Colombia
node demo.js colombia

# Test Mexico  
node demo.js mexico

# Test Spain
node demo.js spain
```

## 🔍 Troubleshooting

### Common Issues:

**"File does not exist"**
- Make sure you're in the right directory
- Check file name spelling

**"Invalid format"**
- Each line must be: `amount_owed,amount_paid`
- Example: `2.50,5.00` ✅
- Example: `2.50,5.00,extra` ❌

**"Amount paid cannot be less than amount owed"**
- Paid amount must be ≥ owed amount
- Example: `5.00,3.00` ❌

## 📊 Test Scenarios

### Scenario 1: Normal Operations
```
Input: 2.12,3.00
Expected: 3 quarters,1 dime,3 pennies
```

### Scenario 2: No Change
```
Input: 5.00,5.00
Expected: No change needed
```

### Scenario 3: Random Change (Special Case)
```
Input: 3.33,5.00
Expected: Random denominations (changes each run)
Note: Amount divisible by 3 triggers random mode
```

### Scenario 4: Edge Cases
```
Input: 0.01,0.02
Expected: 1 penny

Input: 99.99,100.00
Expected: 1 penny
```

## 🎲 Understanding the "Random" Feature

The system has a special rule:
- **Normal change**: Returns minimum denominations (greedy algorithm)
- **Special case**: If the change amount (in cents) is divisible by 3, it returns random denominations
- **Math is always correct**: The sum always equals the exact change needed

### Examples:
- Change of 88 cents → Normal (minimum) change
- Change of 87 cents → Random change (87 ÷ 3 = 29, no remainder)
- Change of 90 cents → Random change (90 ÷ 3 = 30, no remainder)

## 🏆 Success Criteria

Your test is successful if:
- ✅ Program runs without errors
- ✅ Output format matches: `1 dollar,2 quarters,1 nickel`
- ✅ Math is correct (sum equals exact change)
- ✅ Random change works for amounts divisible by 3
- ✅ File processing works for multiple lines

## 🚀 Ready to Test?

Choose any method above and start testing! The system is designed to be robust and handle various scenarios gracefully.

**Need help?** Check `QUICK_START.md` for more detailed instructions.
