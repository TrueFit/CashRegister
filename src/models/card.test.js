import { Suit, Suits, RoyalValue } from 'constants/cards'
import { Card } from 'models'

let mockInfo

jest.mock('utils/logger', () => {
    mockInfo = jest.fn()

    return {
        info: mockInfo,
    }
})

describe('Card', () => {
    describe('constructor', () => {
        it('should throw error if `isValidSuit` returns false', () => {
            const { isValidSuit } = Card
            Card.isValidSuit = jest.fn(() => false)

            expect(() => {
                // eslint-disable-next-line
                new Card('invalid suit', 1)
            }).toThrowError('Invalid suit')

            Card.isValidSuit = isValidSuit
        })

        it('should throw error if `isValidValue` returns false', () => {
            const { isValidValue } = Card
            Card.isValidValue = jest.fn(() => false)

            expect(() => {
                // eslint-disable-next-line
                new Card(Suit.SPADES, 'invalid value')
            }).toThrowError('Invalid value')

            Card.isValidValue = isValidValue
        })

        it('should assign `suit` and `value` if `isValidSuit` and `isValidValue` are true', () => {
            const { isValidSuit, isValidValue } = Card
            Card.isValidSuit = jest.fn(() => true)
            Card.isValidValue = jest.fn(() => true)

            const suit = 'any'
            const value = 10
            const card = new Card(suit, value)

            expect(card.suit).toEqual(suit)
            expect(card.value).toEqual(value)

            Card.isValidSuit = isValidSuit
            Card.isValidValue = isValidValue
        })
    })

    describe('`isValidSuit`', () => {
        it('should return false if passed an invalid suit', () => {
            ;['not-a-suit', '', null, 1].forEach(suit => {
                expect(Card.isValidSuit(suit)).toBe(false)
            })
        })

        it('should return true if passed a valid suit', () => {
            Suits.forEach(suit => {
                expect(Card.isValidSuit(suit)).toBe(true)
            })
        })
    })

    describe('`isValidValue`', () => {
        it('should return false if passed a non-integer value', () => {
            ;['non-integer', '', null].forEach(value => {
                expect(Card.isValidValue(value)).toBe(false)
            })
        })

        it('should return false if passed a value less than 1', () => {
            ;[0, -5].forEach(value => {
                expect(Card.isValidValue(value)).toBe(false)
            })
        })

        it('should return false if passed a value greater than 13', () => {
            ;[14, 500].forEach(value => {
                expect(Card.isValidValue(value)).toBe(false)
            })
        })

        it('should return false if passed a valid value', () => {
            ;[1, 5, 13].forEach(value => {
                expect(Card.isValidValue(value)).toBe(true)
            })
        })

        describe('`prettyValue`', () => {
            it('should return value when it is greater than 1 and less than or equal to 10', () => {
                ;[2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(value => {
                    const card = new Card(Suit.HEARTS, value)
                    expect(card.prettyValue).toEqual(value)
                })
            })

            it('should return accurate `RoyalValue` when value is 1, 11, 12, and 13', () => {
                const expected = [
                    [1, RoyalValue.ACE],
                    [11, RoyalValue.JACK],
                    [12, RoyalValue.QUEEN],
                    [13, RoyalValue.KING],
                ]

                expected.forEach(([rawValue, expectedValue]) => {
                    const card = new Card(Suit.HEARTS, rawValue)
                    expect(card.prettyValue).toEqual(expectedValue)
                })
            })
        })
    })
})
