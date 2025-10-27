import { getCurrencyConfig, getFilteredDenominations, resolveDenominationConflicts } from './currencies'

export function calculateChange(amountOwed, amountPaid, currencyCode = 'USD', settings = {}) {
  const currency = getCurrencyConfig(currencyCode)
  let denominations = getFilteredDenominations(currencyCode, settings)
  denominations = resolveDenominationConflicts(denominations)
  const changeCents = Math.round((amountPaid - amountOwed) * 100)
  if (changeCents < 0) {
    throw new Error('Insufficient payment')
  }
  if (changeCents === 0) {
    return { breakdown: [], formatted: 'No change', changeCents }
  }
  const shouldRandomize = changeCents % 3 === 0
  const breakdown = shouldRandomize
    ? calculateRandomChange(changeCents, denominations)
    : calculateGreedyChange(changeCents, denominations)
  return {
    breakdown,
    formatted: formatChangeString(breakdown),
    changeCents,
    wasRandomized: shouldRandomize
  }
}

function calculateGreedyChange(cents, denominations) {
  const breakdown = []
  let remaining = cents
  for (const denom of denominations) {
    const count = Math.floor(remaining / denom.value)
    if (count > 0) {
      breakdown.push({ ...denom, count })
      remaining -= count * denom.value
    }
  }
  return breakdown
}

function calculateRandomChange(cents, denominations) {
  const maxAttempts = 100
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const breakdown = []
    let remaining = cents
    const shuffled = [...denominations].sort(() => Math.random() - 0.5)
    for (const denom of shuffled) {
      if (remaining === 0) break
      const maxCount = Math.floor(remaining / denom.value)
      if (maxCount > 0) {
        const count = Math.floor(Math.random() * (maxCount + 1))
        if (count > 0) {
          breakdown.push({ ...denom, count })
          remaining -= count * denom.value
        }
      }
    }
    if (remaining === 0 && breakdown.length > 0) {
      return breakdown.sort((a, b) => b.value - a.value)
    }
  }
  return calculateGreedyChange(cents, denominations)
}

function formatChangeString(breakdown) {
  return breakdown
    .map(({ label, count }) => {
      return `${label} x ${count}`
    })
    .join(', ')
}

export function getInitialDrawerState(currencyCode = 'USD', settings = {}) {
  const currency = getCurrencyConfig(currencyCode)
  let denominations = getFilteredDenominations(currencyCode, settings)
  denominations = resolveDenominationConflicts(denominations)
  const drawerState = {}
  denominations.forEach(denom => {
    const valueInDollars = denom.value / 100
    let count
    if (valueInDollars >= 100) {
      count = 10
    } else if (valueInDollars >= 10) {
      count = 20
    } else if (valueInDollars >= 1) {
      count = denom.optional ? 10 : 50
    } else if (valueInDollars >= 0.25) {
      count = 40
    } else {
      count = denom.value === 1 ? 100 : 40
    }
    drawerState[denom.value] = count
  })
  return drawerState
}

export function updateDrawerAfterTransaction(drawerState, changeBreakdown) {
  const updated = { ...drawerState }
  for (const { value, count } of changeBreakdown) {
    updated[value] = Math.max(0, updated[value] - count)
  }
  return updated
}

export function getDenominations(currencyCode = 'USD') {
  const currency = getCurrencyConfig(currencyCode)
  return currency.denominations
}

export function formatCurrency(cents, currencyCode = 'USD') {
  const currency = getCurrencyConfig(currencyCode)
  return `${currency.symbol}${(cents / 100).toFixed(2)}`
}
