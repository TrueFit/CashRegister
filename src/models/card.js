import { Suit, Suits, RoyalValue } from 'constants/cards'

export default class Card {
    constructor(suit, value) {
        if (!Card.isValidSuit(suit)) {
            throw new Error(`Invalid suit: ${suit}`)
        }

        if (!Card.isValidValue(value)) {
            throw new Error(`Invalid value: ${value}`)
        }

        this.suit = suit
        this.value = value
    }

    // let only specified suits be considered valid
    static isValidSuit(suit) {
        return Suits.includes(suit)
    }

    // let int values in the range [1, 13] inclusive be considered valid
    static isValidValue(value) {
        return Number.isInteger(Number(value)) && value >= 1 && value <= 13
    }

    // for integers, just print `value` as-is;
    // for royal values (Ace, Jack, Queen, King),
    // grab the value formatted for pretty display
    get prettyValue() {
        if (this.value > 1 && this.value <= 10) {
            return this.value
        }

        if (this.value === 1) {
            return RoyalValue.ACE
        }

        if (this.value === 11) {
            return RoyalValue.JACK
        }

        if (this.value === 12) {
            return RoyalValue.QUEEN
        }

        return RoyalValue.KING
    }

    // returns unicode character for each suit
    get prettySuit() {
        return {
            [Suit.SPADES]: '♠',
            [Suit.HEARTS]: '♥',
            [Suit.DIAMONDS]: '♦',
            [Suit.CLUBS]: '♣',
        }[this.suit]
    }

    // returns a string (useful for debugging)
    get pretty() {
        return `${this.prettyValue}${this.prettySuit}`
    }
}
