const CURRENCY_CONFIG = {
  USD: {
    code: 'USD',
    denominations: [
      { value: 100, singular: 'dollar', plural: 'dollars' },
      { value: 25, singular: 'quarter', plural: 'quarters' },
      { value: 10, singular: 'dime', plural: 'dimes' },
      { value: 5, singular: 'nickel', plural: 'nickels' },
      { value: 1, singular: 'penny', plural: 'pennies' }
    ]
  },
  EUR: {
    code: 'EUR',
    denominations: [
      { value: 100, singular: 'euro', plural: 'euros' },
      { value: 50, singular: '50 cents', plural: '50 cents' },
      { value: 20, singular: '20 cents', plural: '20 cents' },
      { value: 10, singular: '10 cents', plural: '10 cents' },
      { value: 5, singular: '5 cents', plural: '5 cents' },
      { value: 2, singular: '2 cents', plural: '2 cents' },
      { value: 1, singular: '1 cent', plural: '1 cent' }
    ]
  },
  GBP: {
    code: 'GBP',
    denominations: [
      { value: 100, singular: 'pound', plural: 'pounds' },
      { value: 50, singular: '50 pence', plural: '50 pence' },
      { value: 20, singular: '20 pence', plural: '20 pence' },
      { value: 10, singular: '10 pence', plural: '10 pence' },
      { value: 5, singular: '5 pence', plural: '5 pence' },
      { value: 2, singular: '2 pence', plural: '2 pence' },
      { value: 1, singular: 'penny', plural: 'pence' }
    ]
  }
}

export function listSupportedCurrencies() {
  return Object.keys(CURRENCY_CONFIG)
}

export function parseAmountToMinorUnits(input) {
  if (typeof input === 'number') return Math.round(input * 100)
  if (typeof input !== 'string') return NaN
  const trimmed = input.trim()
  if (!trimmed) return NaN
  const num = Number(trimmed)
  if (Number.isNaN(num)) return NaN
  return Math.round(num * 100)
}

export function makeChange(price, cash, currency = 'USD') {
  const cfg = CURRENCY_CONFIG[currency]
  if (!cfg) throw new Error(`Unsupported currency: ${currency}`)

  const priceCents = parseAmountToMinorUnits(price)
  const cashCents = parseAmountToMinorUnits(cash)
  if (!Number.isFinite(priceCents) || !Number.isFinite(cashCents)) {
    return { ok: false, error: 'invalid input' }
  }
  const diff = cashCents - priceCents
  if (diff < 0) return { ok: false, error: 'insufficient payment' }
  if (diff === 0) return { ok: true, parts: [], text: 'no change' }

  let remaining = diff
  const parts = []
  for (const d of cfg.denominations) {
    if (remaining <= 0) break
    const count = Math.floor(remaining / d.value)
    if (count > 0) {
      parts.push({ count, singular: d.singular, plural: d.plural })
      remaining -= count * d.value
    }
  }

  const text = parts
    .map(({ count, singular, plural }) => `${count} ${count === 1 ? singular : plural}`)
    .join(',')

  return { ok: true, parts, text }
}

export function processBulkLines(lines, currency = 'USD') {
  const results = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const [price, cash] = line.split(',')
    if (cash === undefined) {
      results.push('invalid input')
      continue
    }
    const res = makeChange(price, cash, currency)
    if (!res.ok) {
      results.push(res.error)
    } else {
      results.push(res.text)
    }
  }
  return results.join('\n\n')
}
