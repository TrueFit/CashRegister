import { Card } from 'models'
import { Suits } from 'constants/cards'

export default class Deck {
    constructor() {
        this.cards = Suits.reduce(
            (acc, suit) => [...acc, ...Deck.initCardsForSuit(suit)],
            []
        )
    }

    static initCardsForSuit(suit) {
        const cardsForSuit = []

        for (let i = 1; i <= 13; i += 1) {
            cardsForSuit.push(new Card(suit, i))
        }

        return cardsForSuit
    }

    // Randomize array in place using the Durstenfeld shuffle algorithm
    // http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/12646864#12646864
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
        }
    }

    hasCards() {
        return this.cards.length > 0
    }

    // if there are no cards remaining in the deck, return null;
    // otherwise, remove and return the first card in the deck
    dealCard() {
        if (!this.hasCards()) {
            return null
        }

        return this.cards.shift()
    }

    get pretty() {
        return this.cards.map(card => card.pretty)
    }
}
