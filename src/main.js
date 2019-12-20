import { Deck, Card } from 'models'
import { Suit } from 'constants/cards'
import { Logger } from 'utils'

const deck = new Deck()
Logger.info('Deck has %d cards: %j', deck.cards.length, deck.pretty)

deck.shuffle()
Logger.info('Deck has %d cards: %j', deck.cards.length, deck.pretty)

const dealtCard = deck.dealCard()
Logger.info('Dealt Card: %s', dealtCard.pretty)

const card = new Card(Suit.DIAMONDS, 4)
Logger.info('New Card: %s', card.pretty)