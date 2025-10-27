export const CURRENCIES = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    denominations: [
      { value: 10000, label: '$100', type: 'bill', wordForm: 'hundred dollar bill' },
      { value: 5000, label: '$50', type: 'bill', wordForm: 'fifty dollar bill' },
      { value: 2000, label: '$20', type: 'bill', wordForm: 'twenty dollar bill' },
      { value: 1000, label: '$10', type: 'bill', wordForm: 'ten dollar bill' },
      { value: 500, label: '$5', type: 'bill', wordForm: 'five dollar bill' },
      { value: 200, label: '$2', type: 'bill', optional: true, setting: 'use2DollarBill', wordForm: 'two dollar bill' },
      { value: 100, label: '$1', type: 'bill', wordForm: 'dollar' },
      { value: 100, label: '$1', type: 'coin', optional: true, setting: 'use1DollarCoin', displayLabel: '$1 coin', wordForm: 'dollar coin' },
      { value: 25, label: '25¢', type: 'coin', wordForm: 'quarter' },
      { value: 10, label: '10¢', type: 'coin', wordForm: 'dime' },
      { value: 5, label: '5¢', type: 'coin', wordForm: 'nickel' },
      { value: 1, label: '1¢', type: 'coin', wordForm: 'penny' }
    ],
    optionalDenominations: {
      use2DollarBill: { value: 200, label: '$2', type: 'bill', initialCount: 0 },
      use1DollarCoin: { value: 100, label: '$1 coin', type: 'coin', initialCount: 0 }
    }
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    denominations: [
      { value: 50000, label: '€500', type: 'bill' },
      { value: 20000, label: '€200', type: 'bill' },
      { value: 10000, label: '€100', type: 'bill' },
      { value: 5000, label: '€50', type: 'bill' },
      { value: 2000, label: '€20', type: 'bill' },
      { value: 1000, label: '€10', type: 'bill' },
      { value: 500, label: '€5', type: 'bill' },
      { value: 200, label: '€2', type: 'coin' },
      { value: 100, label: '€1', type: 'coin' },
      { value: 50, label: '50c', type: 'coin' },
      { value: 20, label: '20c', type: 'coin' },
      { value: 10, label: '10c', type: 'coin' },
      { value: 5, label: '5c', type: 'coin' },
      { value: 2, label: '2c', type: 'coin' },
      { value: 1, label: '1c', type: 'coin' }
    ]
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    denominations: [
      { value: 5000, label: '£50', type: 'bill' },
      { value: 2000, label: '£20', type: 'bill' },
      { value: 1000, label: '£10', type: 'bill' },
      { value: 500, label: '£5', type: 'bill' },
      { value: 200, label: '£2', type: 'coin' },
      { value: 100, label: '£1', type: 'coin' },
      { value: 50, label: '50p', type: 'coin' },
      { value: 20, label: '20p', type: 'coin' },
      { value: 10, label: '10p', type: 'coin' },
      { value: 5, label: '5p', type: 'coin' },
      { value: 2, label: '2p', type: 'coin' },
      { value: 1, label: '1p', type: 'coin' }
    ]
  }
}

export function getCurrencyConfig(currencyCode) {
  return CURRENCIES[currencyCode] || CURRENCIES.USD
}

export function formatCurrencyAmount(cents, currencyCode) {
  const currency = getCurrencyConfig(currencyCode)
  return `${currency.symbol}${(cents / 100).toFixed(2)}`
}

export function getFilteredDenominations(currencyCode, settings = {}) {
  const currency = getCurrencyConfig(currencyCode)

  return currency.denominations.filter((denom) => {
    if (!denom.optional) return true
    if (denom.setting && settings[denom.setting]) {
      return true
    }
    return false
  }).map((denom) => {
    return denom
  })
}

export function resolveDenominationConflicts(denominations) {
  const grouped = {}
  denominations.forEach(denom => {
    if (!grouped[denom.value]) {
      grouped[denom.value] = []
    }
    grouped[denom.value].push(denom)
  })
  return Object.values(grouped)
    .map(group => {
      if (group.length === 1) return group[0]
      const bill = group.find(d => d.type === 'bill')
      return bill || group[0]
    })
    .sort((a, b) => b.value - a.value)
}
