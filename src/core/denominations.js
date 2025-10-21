// Denominations configuration for different countries
const DENOMINATIONS_BY_COUNTRY = {
  US: {
    currency: 'USD',
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
    currency: 'COP',
    symbol: '$',
    denominations: [
      { name: 'billete de 100000', value: 10000000, plural: 'billetes de 100000' },
      { name: 'billete de 50000', value: 5000000, plural: 'billetes de 50000' },
      { name: 'billete de 20000', value: 2000000, plural: 'billetes de 20000' },
      { name: 'billete de 10000', value: 1000000, plural: 'billetes de 10000' },
      { name: 'billete de 5000', value: 500000, plural: 'billetes de 5000' },
      { name: 'billete de 2000', value: 200000, plural: 'billetes de 2000' },
      { name: 'billete de 1000', value: 100000, plural: 'billetes de 1000' },
      { name: 'moneda de 1000', value: 100000, plural: 'monedas de 1000' },
      { name: 'moneda de 500', value: 50000, plural: 'monedas de 500' },
      { name: 'moneda de 200', value: 20000, plural: 'monedas de 200' },
      { name: 'moneda de 100', value: 10000, plural: 'monedas de 100' },
      { name: 'moneda de 50', value: 5000, plural: 'monedas de 50' }
    ]
  },
  MEXICO: {
    currency: 'MXN',
    symbol: '$',
    denominations: [
      { name: 'billete de 500', value: 50000, plural: 'billetes de 500' },
      { name: 'billete de 200', value: 20000, plural: 'billetes de 200' },
      { name: 'billete de 100', value: 10000, plural: 'billetes de 100' },
      { name: 'billete de 50', value: 5000, plural: 'billetes de 50' },
      { name: 'billete de 20', value: 2000, plural: 'billetes de 20' },
      { name: 'moneda de 10', value: 1000, plural: 'monedas de 10' },
      { name: 'moneda de 5', value: 500, plural: 'monedas de 5' },
      { name: 'moneda de 2', value: 200, plural: 'monedas de 2' },
      { name: 'moneda de 1', value: 100, plural: 'monedas de 1' },
      { name: 'moneda de 50 centavos', value: 50, plural: 'monedas de 50 centavos' }
    ]
  },
  SPAIN: {
    currency: 'EUR',
    symbol: '€',
    denominations: [
      { name: 'billete de 500', value: 50000, plural: 'billetes de 500' },
      { name: 'billete de 200', value: 20000, plural: 'billetes de 200' },
      { name: 'billete de 100', value: 10000, plural: 'billetes de 100' },
      { name: 'billete de 50', value: 5000, plural: 'billetes de 50' },
      { name: 'billete de 20', value: 2000, plural: 'billetes de 20' },
      { name: 'billete de 10', value: 1000, plural: 'billetes de 10' },
      { name: 'moneda de 5', value: 500, plural: 'monedas de 5' },
      { name: 'moneda de 2', value: 200, plural: 'monedas de 2' },
      { name: 'moneda de 1', value: 100, plural: 'monedas de 1' },
      { name: 'moneda de 50 centavos', value: 50, plural: 'monedas de 50 centavos' },
      { name: 'moneda de 20 centavos', value: 20, plural: 'monedas de 20 centavos' },
      { name: 'moneda de 10 centavos', value: 10, plural: 'monedas de 10 centavos' },
      { name: 'moneda de 5 centavos', value: 5, plural: 'monedas de 5 centavos' },
      { name: 'moneda de 2 centavos', value: 2, plural: 'monedas de 2 centavos' },
      { name: 'moneda de 1 centavo', value: 1, plural: 'monedas de 1 centavo' }
    ]
  }
};

// Factory to get denominations by country
function DenominationsFactory() {}

DenominationsFactory.getDenominations = function(countryCode) {
  const country = DENOMINATIONS_BY_COUNTRY[countryCode.toUpperCase()];
  if (!country) {
    throw new Error(`País no soportado: ${countryCode}`);
  }
  return country;
};

DenominationsFactory.getSupportedCountries = function() {
  return Object.keys(DENOMINATIONS_BY_COUNTRY);
};

DenominationsFactory.addCountry = function(countryCode, currency, symbol, denominations) {
  DENOMINATIONS_BY_COUNTRY[countryCode.toUpperCase()] = {
    currency: currency,
    symbol: symbol,
    denominations: denominations
  };
};

// For compatibility, maintain original export
const DENOMINATIONS = DENOMINATIONS_BY_COUNTRY.US.denominations;

module.exports = {
  DENOMINATIONS: DENOMINATIONS,
  DENOMINATIONS_BY_COUNTRY: DENOMINATIONS_BY_COUNTRY,
  DenominationsFactory: DenominationsFactory
};