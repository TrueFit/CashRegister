# Cash Register

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?
---

## Solution

### How to Run

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Using the Application

1. **Configure** - Set the random divisor (default: 3) and enable/disable random feature
2. **Upload File** - Drag and drop or browse for a `.txt` file with format: `owed,paid` per line
3. **View Results** - See calculated change for each transaction in a table
4. **Download** - Export results to a text file or copy to clipboard

A sample input file (`sample-input.txt`) is included in the project root for testing.

### Architecture & Design

See [SOLUTION.md](./SOLUTION.md) for detailed documentation including:
- Architecture overview
- Key design decisions
- How extensibility requirements are addressed
- Testing strategy
- Technology choices

### Key Features

- ✅ Accepts flat file input (CSV format)
- ✅ Minimum change calculation (greedy algorithm)
- ✅ Random denominations when owed amount divisible by 3
- ✅ Configurable divisor in UI
- ✅ Professional React interface
- ✅ Download/copy results
- ✅ Comprehensive test suite
- ✅ Extensible architecture (strategy pattern, currency system)

### Tech Stack

- **React 19** + **Vite** - Modern UI framework and build tool
- **TypeScript** - Type safety and better developer experience
- **Jest** - Testing framework
- **CSS** - Custom styling (no framework dependencies)
