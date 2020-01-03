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
import { Currency, Currencies } from 'constants/currency'

// Durstenfled shuffle algo
function sortArrayRandom(array) {
    const shuffled = [...array]

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
}

const hasValues = entry => Array.isArray(entry)

// Append the current denomination to the previous list of denominations IF:
// A) `denomsForAmount[subAmount]` has no values,
// meaning we don't yet have any combos of denominations that will sum to `subAmount`.
// -- OR --
// B) The length of `prevDenoms` plus 1 for the current denom is less than
// the length of the previous entry for this `subAmount`, ie it takes fewer denoms to make `subAmount`.
const shouldAppendCurrentDenom = ({ prevDenoms, subAmount, denomsForAmount }) =>
    !hasValues(denomsForAmount[subAmount]) ||
    prevDenoms.length + 1 < denomsForAmount[subAmount].length

const getMinDenoms = (denominations, amount) => {
    // Init 2D array that will store the optimal solution for each value (`subAmount`) from 0 to `amount`.
    // Each entry is the array of the minimum denominations needed to compose `subAmount`.
    const denomsForAmount = new Array(amount + 1)

    // Base case: 0 coins are needed to make amount of 0
    denomsForAmount[0] = []

    // Now, solve for all amounts 1-`amount`
    for (let subAmount = 1; subAmount <= amount; subAmount++) {
        // Init each to null
        denomsForAmount[subAmount] = null

        // Try every denomination one a time to find the minimum combo
        // for each `subAmount`
        for (let i = 0; i < denominations.length; i++) {
            const denom = denominations[i]
            const { value } = denom

            if (value <= subAmount) {
                const prevDenoms = denomsForAmount[subAmount - value]
                if (
                    shouldAppendCurrentDenom({
                        subAmount,
                        denomsForAmount,
                        prevDenoms,
                    })
                ) {
                    denomsForAmount[subAmount] = [...prevDenoms, denom]
                }
            }
        }
    }

    // Return optimal solution for given `amount`
    return denomsForAmount[amount]
}

const formatMinDenoms = entries => {
    // `entries` is an array of denominations.
    // Here we format the array into a shape mapping `value` for each entry to { count, denomination }

    return entries.reduce((acc, denomination) => {
        const { value } = denomination

        return {
            ...acc,
            [value]: {
                denomination,
                count: (acc[value]?.count || 0) + 1,
            },
        }
    }, {})
}

const getRandomDenoms = ({ owed, currency }) => {
    // Initially, the amount equals just the normalized `owed`
    let amount = currency.normalizeAmount(owed)

    // `sort` to randomly arrange the denominations
    const denominations = currency.denominations.sort(sortArrayRandom)

    // `result` will be an object mapping the `value` of the denomination to { count, denomination }
    let result = {}

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

        result = {
            ...result,
            [denomination.value]: {
                count,
                denomination,
            },
        }
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
        Logger.error('Currency not recognized')
        return null
    }

    const entries = await getEntriesFromFile(inputFile)
    let output = []

    for (const entry of entries) {
        const [owed, paid] = entry.split(',')

        let results
        let subject

        if (shouldRandomize({ owed, currency, divisor })) {
            subject = `Can randomly make ${currency.formatAmount(
                owed
            )} with the following: %s`

            results = getRandomDenoms({
                owed,
                currency,
            })
        } else {
            results = formatMinDenoms(
                getMinDenoms(
                    currency.denominations,
                    currency.normalizeAmount(owed)
                )
            )

            subject = `Can make ${currency.formatAmount(
                owed
            )} with the following: %s`
        }

        const entryOutput = Object.keys(results).reduce((acc, key) => {
            const { count, denomination } = results[key]
            return [...acc, prettifyEntry({ count, denomination })]
        }, [])

        Logger.info(subject, entryOutput.join(', '))
        output.push(entryOutput)
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
