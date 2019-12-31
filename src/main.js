/*
Creative Cash Draw Solutions is a client who wants to
provide something different for the cashiers who use their
system. The function of the application is to tell the cashier
 how much change is owed, and what denominations should be used.
 In most cases the app should return the minimum amount of physical change,
 but the client would like to add a twist. If the "owed" amount is divisible by 3,
 the app should randomly generate the change denominations
 (but the math still needs to be right :))

- What might happen if the client needs to change the random divisor?
- What might happen if the client needs to add another special case (like the random twist)?
- What might happen if sales closes a new client in France?
*/

import { promises as fs } from 'fs'
import { argv } from 'yargs'
import path from 'path'
import { Logger } from 'utils'

const ArraySort = {
    ASC: 'ascending',
    RANDOM: 'random',
}

const Currency = {
    USD: 'usd',
}

const USD = {
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
    ],
    symbol: '$',
    formatAmount: amount => `$${amount}`,
    normalizeAmount: amount => 100 * amount,
    denormalizeAmount: amount => amount / 100,
}

const Currencies = [USD]

const sortDenominationsAsc = array => [
    ...array.sort((a, b) => a.value - b.value),
]

// Durstenfled shuffle algo
function sortArrayRandom(array) {
    const shuffled = [...array]

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
}

const sortFunctionMap = {
    [ArraySort.ASC]: sortDenominationsAsc,
    [ArraySort.RANDOM]: sortArrayRandom,
}

const getChange = ({ owed, currency, sort = ArraySort.ASC }) => {
    // Initially, the amount equals just the normalized `owed`
    let amount = currency.normalizeAmount(owed)

    // `sort` just to be sure we have them in ASC order
    const denominations = sortFunctionMap[sort].call(
        null,
        currency.denominations
    )

    // `result` will be an array of arrays in the form [piece, count]
    const result = []

    while (amount > 0) {
        // Get the next greatest value
        const denomination = denominations.pop()
        const { value } = denomination

        // See how many times we need that denomination
        const count = Math.floor(amount / value)

        // If we don't need this denomination, skip it
        if (count === 0) {
            continue
        }

        // Reduce `amount`
        amount -= count * value

        result.push({ count, denomination })
    }

    return result
}

const getEntriesFromFile = async (file, encoding = 'utf8') => {
    try {
        const contents = await fs.readFile(file, encoding)
        return contents?.split('\n')
    } catch (e) {
        Logger.error('Error reading file', e)
    }

    return []
}

const writeContentsToFile = (file, contents) => fs.writeFile(file, contents)

const prettifyEntry = ({ count, denomination }) => {
    return [
        count,
        count === 1 && denomination.singular,
        count > 1 && denomination.plural,
    ]
        .filter(Boolean)
        .join(' ')
}

const shouldRandomize = ({ owed, currency, divisor }) =>
    currency.normalizeAmount(owed) % divisor === 0

const main = async ({ currencyId, divisor, inputFile, outputFile }) => {
    if (!inputFile) {
        Logger.error('`inputFile` is a required arg')
        return null
    }

    const currency = Currencies.find(
        ({ id }) => id.toLowerCase() === currencyId.toLowerCase()
    )
    if (!currency) {
        return null
    }

    const entries = await getEntriesFromFile(inputFile)
    let output = []

    for (const entry of entries) {
        const [owed, paid] = entry.split(',')

        let params
        let subject

        if (shouldRandomize({ owed, currency, divisor })) {
            params = { owed, currency, sort: ArraySort.RANDOM }
            subject = `Can randomly make ${currency.formatAmount(
                owed
            )} with the following: %s`
        } else {
            params = { owed, currency, sort: ArraySort.ASC }
            subject = `Can make ${currency.formatAmount(
                owed
            )} with the following: %s`
        }

        const change = getChange(params)
        const contents = change
            .map(({ count, denomination }) =>
                prettifyEntry({ count, denomination })
            )
            .join(', ')
        output.push(contents)

        Logger.info(subject, contents)
    }

    try {
        await writeContentsToFile(outputFile, output.join('\n'))
    } catch (e) {
        Logger.error('Error writing contents to file', e)
    }
}

main({
    currencyId: argv.currency || Currency.USD,
    divisor: argv.divisor || 3,
    outputFile: argv.outputFile || path.join(__dirname, 'out.txt'),
    // Note that `inputFile` is required
    inputFile: argv.inputFile,
})
