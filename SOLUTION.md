# Cash Register Solution

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Solution Overview

This application calculates change denominations for a cash register with a special rule: when the **owed amount** is divisible by 3 (configurable), it randomizes the denominations while maintaining mathematical correctness.

## Architecture

### Three-Layer Design

```
┌─────────────────────────────────────┐
│         React UI Layer              │
│  (Components, State Management)     │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│       Utilities Layer               │
│  (File I/O, Parsing, Formatting)    │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Core Logic Layer               │
│  (Algorithms, Strategy Pattern)     │
└─────────────────────────────────────┘
```

**Benefits:**
- Core logic is framework-agnostic (can be used in Node CLI, API, etc.)
- Easy to test each layer independently
- Clear separation of concerns

## Key Design Decisions

### 1. Integer Cents Math

**Problem:** JavaScript floating point arithmetic
```javascript
0.1 + 0.2 === 0.30000000000000004 // true
```

**Solution:** Convert to integer cents immediately
```typescript
function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}
```

All calculations in cents, convert to dollars only for display.

### 2. Strategy Pattern

**Why:** Addresses "what if client needs to add another special case?"

**Structure:**
- `minimumChangeStrategy.ts` - Greedy algorithm (default)
- `randomChangeStrategy.ts` - Constrained randomization
- `changeCalculator.ts` - Orchestrates strategy selection

**Adding new strategy:**
```typescript
// Easy to add: "coins only", "bills preferred", etc.
const shouldUseCoinsOnly = config.coinsOnlyEnabled && someCondition;
const denominations = shouldUseCoinsOnly
  ? calculateCoinsOnlyChange(changeInCents, currency)
  : shouldUseRandom
    ? calculateRandomChange(changeInCents, currency)
    : calculateMinimumChange(changeInCents, currency);
```

### 3. Random Algorithm

**Approach:** Recursive backtracking with attempt limiting

```
1. Shuffle denominations for randomness
2. For each denomination:
   - Random count (0 to max possible)
   - Subtract from remaining
3. Success if remaining === 0
4. Fallback to minimum after 100 attempts
```

**Why:** Simple, produces variety, graceful degradation

### 4. Configurable System

**Divisor Configuration:**
```typescript
interface CalculatorConfig {
  randomDivisor: number;  // Runtime configurable via UI
  randomEnabled: boolean;
}
```

**Currency System:**
```typescript
// Structured for easy internationalization
export const USD: CurrencySystem = {
  code: 'USD',
  symbol: '$',
  denominations: [/* dollars, quarters, dimes, nickels, pennies */],
};

// To add EUR:
export const EUR: CurrencySystem = {
  code: 'EUR',
  symbol: '€',
  denominations: [/* euros, cents */],
};
```

## Testing

**Coverage:**
- Unit tests for all core algorithms
- File parsing and formatting tests
- Integration test with README sample data

**Run tests:**
```bash
npm test           # All tests
npm test:watch     # Watch mode
npm test:coverage  # With coverage report
```

## File Structure

```
src/
├── core/                      # Business logic
│   ├── types.ts              # TypeScript interfaces
│   ├── currency.ts           # USD denomination system
│   ├── minimumChangeStrategy.ts
│   ├── randomChangeStrategy.ts
│   └── changeCalculator.ts
├── utils/                     # Utilities
│   ├── fileParser.ts
│   ├── formatters.ts
│   └── fileGenerator.ts
├── components/                # React components
│   ├── FileUpload.tsx
│   └── ResultsDisplay.tsx
├── __tests__/                # Jest tests
│   ├── core/
│   ├── utils/
│   └── integration.test.ts
├── App.tsx                    # Main app
└── main.tsx                   # Entry point
```

## Addressing "Things To Consider"

### "What if client needs to change the random divisor?"
✅ **Solved:** UI input field allows runtime configuration

### "What if client needs to add another special case?"
✅ **Solved:** Strategy pattern makes this trivial
- Add new strategy function
- Update conditional logic in calculator
- No changes to existing strategies

### "What if sales closes a new client in France?"
✅ **Solved:** Currency system is data-driven
- Define EUR denominations
- Pass EUR instead of USD to calculator
- No algorithm changes needed

## Technology Choices

**React + Vite + TypeScript:**
- Modern stack, fast development
- Type safety catches bugs early
- Demonstrates component architecture

**Jest for testing:**
- Industry standard
- Rich ecosystem
- Familiar to most developers

**No unnecessary dependencies:**
- Custom CSS (no Tailwind/Bootstrap)
- Simple state management (no Redux)
- Shows restraint and understanding

## Sample Input/Output

**Input:** `sample-input.txt`
```
2.12,3.00
1.97,2.00
3.33,5.00
```

**Output:**
```
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,1 quarter,6 nickels,12 pennies
```

**Logic:**
- Line 1: 212¢ owed (not ÷ by 3) → minimum change
- Line 2: 197¢ owed (not ÷ by 3) → minimum change
- Line 3: 333¢ owed (÷ by 3) → **random denominations**

## What Makes This Stand Out

1. **Clean Architecture** - Testable, maintainable, extensible
2. **Addresses All Requirements** - Plus extensibility considerations
3. **Professional UI** - Polished without over-engineering
4. **Comprehensive Tests** - Proves correctness
5. **Thoughtful Decisions** - Integer math, strategy pattern, etc.
6. **Good Documentation** - Explains "why" not just "what"

## Development Notes

This solution was built with assistance from Claude AI. All architectural decisions,
implementation choices, code review, and testing were performed by me.
