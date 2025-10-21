// Simplified Cash Register for Web Browser
// This is a browser-compatible version of the Node.js Cash Register

// Denominations for different countries
const DENOMINATIONS_BY_COUNTRY = {
  US: {
    name: 'United States',
    symbol: '$',
    denominations: [
      { name: 'dollar', value: 100, plural: 'dollars' },
      { name: 'quarter', value: 25, plural: 'quarters' },
      { name: 'dime', value: 10, plural: 'dimes' },
      { name: 'nickel', value: 5, plural: 'nickels' },
      { name: 'penny', value: 1, plural: 'pennies' }
    ]
  },
  COLOMBIA: {
    name: 'Colombia',
    symbol: '$',
    denominations: [
      { name: 'billete de 100000', value: 100000, plural: 'billetes de 100000' },
      { name: 'billete de 50000', value: 50000, plural: 'billetes de 50000' },
      { name: 'billete de 20000', value: 20000, plural: 'billetes de 20000' },
      { name: 'billete de 10000', value: 10000, plural: 'billetes de 10000' },
      { name: 'billete de 5000', value: 5000, plural: 'billetes de 5000' },
      { name: 'billete de 2000', value: 2000, plural: 'billetes de 2000' },
      { name: 'billete de 1000', value: 1000, plural: 'billetes de 1000' },
      { name: 'moneda de 1000', value: 1000, plural: 'monedas de 1000' },
      { name: 'moneda de 500', value: 500, plural: 'monedas de 500' },
      { name: 'moneda de 200', value: 200, plural: 'monedas de 200' },
      { name: 'moneda de 100', value: 100, plural: 'monedas de 100' },
      { name: 'moneda de 50', value: 50, plural: 'monedas de 50' }
    ]
  },
  MEXICO: {
    name: 'Mexico',
    symbol: '$',
    denominations: [
      { name: 'billete de 1000', value: 1000, plural: 'billetes de 1000' },
      { name: 'billete de 500', value: 500, plural: 'billetes de 500' },
      { name: 'billete de 200', value: 200, plural: 'billetes de 200' },
      { name: 'billete de 100', value: 100, plural: 'billetes de 100' },
      { name: 'billete de 50', value: 50, plural: 'billetes de 50' },
      { name: 'billete de 20', value: 20, plural: 'billetes de 20' },
      { name: 'moneda de 20', value: 20, plural: 'monedas de 20' },
      { name: 'moneda de 10', value: 10, plural: 'monedas de 10' },
      { name: 'moneda de 5', value: 5, plural: 'monedas de 5' },
      { name: 'moneda de 2', value: 2, plural: 'monedas de 2' },
      { name: 'moneda de 1', value: 1, plural: 'monedas de 1' },
      { name: 'moneda de 50 centavos', value: 0.5, plural: 'monedas de 50 centavos' }
    ]
  },
  SPAIN: {
    name: 'Spain',
    symbol: '€',
    denominations: [
      { name: 'billete de 500', value: 500, plural: 'billetes de 500' },
      { name: 'billete de 200', value: 200, plural: 'billetes de 200' },
      { name: 'billete de 100', value: 100, plural: 'billetes de 100' },
      { name: 'billete de 50', value: 50, plural: 'billetes de 50' },
      { name: 'billete de 20', value: 20, plural: 'billetes de 20' },
      { name: 'billete de 10', value: 10, plural: 'billetes de 10' },
      { name: 'moneda de 5', value: 5, plural: 'monedas de 5' },
      { name: 'moneda de 2', value: 2, plural: 'monedas de 2' },
      { name: 'moneda de 1', value: 1, plural: 'monedas de 1' },
      { name: 'moneda de 50 centavos', value: 0.5, plural: 'monedas de 50 centavos' },
      { name: 'moneda de 20 centavos', value: 0.2, plural: 'monedas de 20 centavos' },
      { name: 'moneda de 10 centavos', value: 0.1, plural: 'monedas de 10 centavos' },
      { name: 'moneda de 5 centavos', value: 0.05, plural: 'monedas de 5 centavos' },
      { name: 'moneda de 2 centavos', value: 0.02, plural: 'monedas de 2 centavos' },
      { name: 'moneda de 1 centavo', value: 0.01, plural: 'monedas de 1 centavo' }
    ]
  }
};

// Denominations Factory
class DenominationsFactory {
  static getDenominations(countryCode) {
    const country = DENOMINATIONS_BY_COUNTRY[countryCode.toUpperCase()];
    if (!country) {
      throw new Error(`Country not supported: ${countryCode}`);
    }
    return country;
  }

  static getSupportedCountries() {
    return Object.keys(DENOMINATIONS_BY_COUNTRY);
  }
}

// Base Strategy
class ChangeStrategy {
  calculate(changeInCents, denominations) {
    throw new Error('Calculate method must be implemented by subclass');
  }
}

// Minimum Change Strategy
class MinimumChangeStrategy extends ChangeStrategy {
  calculate(changeInCents, denominations) {
    const result = [];
    let remaining = changeInCents;

    for (const denomination of denominations) {
      const count = Math.floor(remaining / denomination.value);
      if (count > 0) {
        const name = count === 1 ? denomination.name : denomination.plural;
        result.push(`${count} ${name}`);
        remaining -= count * denomination.value;
      }
    }

    return result.join(',');
  }
}

// Random Change Strategy
class RandomChangeStrategy extends ChangeStrategy {
  calculate(changeInCents, denominations) {
    const result = [];
    let remaining = changeInCents;

    while (remaining > 0) {
      // Filter valid denominations
      const validDenominations = denominations.filter(denom => denom.value <= remaining);
      
      if (validDenominations.length === 0) break;

      // Select a random denomination
      const randomIndex = Math.floor(Math.random() * validDenominations.length);
      const selectedDenomination = validDenominations[randomIndex];

      // Calculate how many we can use
      const maxCount = Math.floor(remaining / selectedDenomination.value);
      const count = Math.floor(Math.random() * maxCount) + 1;

      if (count > 0) {
        const name = count === 1 ? selectedDenomination.name : selectedDenomination.plural;
        result.push(`${count} ${name}`);
        remaining -= count * selectedDenomination.value;
      }
    }

    return result.join(',');
  }
}

// Strategy Factory
class ChangeStrategyFactory {
  static createStrategy(changeInCents) {
    if (changeInCents % 3 === 0) {
      return new RandomChangeStrategy();
    } else {
      return new MinimumChangeStrategy();
    }
  }
}

// Cash Register Builder
class CashRegisterBuilder {
  constructor() {
    this.countryCode = 'US';
  }

  setCountry(countryCode) {
    this.countryCode = countryCode;
    return this;
  }

  build() {
    return new CashRegister(this.countryCode);
  }
}

// Main Cash Register Class
class CashRegister {
  constructor(countryCode = 'US') {
    this.countryCode = countryCode;
    const countryConfig = DenominationsFactory.getDenominations(countryCode);
    this.denominations = countryConfig.denominations;
  }

  calculateChange(owed, paid) {
    // Validate input
    if (owed < 0 || paid < 0) {
      throw new Error('Amounts cannot be negative');
    }
    
    if (paid < owed) {
      throw new Error('Amount paid cannot be less than amount owed');
    }

    const changeInCents = Math.round((paid - owed) * 100);
    
    if (changeInCents === 0) {
      return 'No change needed';
    }

    // Use Factory to get the correct strategy
    const strategy = ChangeStrategyFactory.createStrategy(changeInCents);
    return strategy.calculate(changeInCents, this.denominations);
  }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CashRegister, CashRegisterBuilder, DenominationsFactory };
}
