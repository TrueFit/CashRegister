export const Currency = {
    USD: 'usd',
}

export const USD = {
    id: Currency.USD,
    denominations: [
        { value: 1, singular: 'penny', plural: 'pennies' },
        { value: 5, singular: 'nickel', plural: 'nickels' },
        { value: 10, singular: 'dime', plural: 'dimes' },
        {
            value: 25,
            singular: 'quarter',
            plural: 'quarters',
        },
        {
            value: 100,
            singular: 'dollar',
            plural: 'dollars',
        },
        {
            value: 500,
            singular: '5-dollar bill',
            plural: '5-dollar bills',
        },
        {
            value: 1000,
            singular: '10-dollar bill',
            plural: '10-dollar bills',
        },
        {
            value: 2000,
            singular: '20-dollar bill',
            plural: '20-dollar bills',
        },
        {
            value: 5000,
            singular: '50-dollar bill',
            plural: '50-dollar bills',
        },
        {
            value: 10000,
            singular: '100-dollar bill',
            plural: '100-dollar bills',
        },
    ],
    symbol: '$',
    formatAmount: amount => `$${amount}`,
    normalizeAmount: amount => 100 * amount,
    denormalizeAmount: amount => amount / 100,
}

export const Currencies = [USD]
