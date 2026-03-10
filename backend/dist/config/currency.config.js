"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCY_DENOMINATIONS = exports.EUR_DENOMINATIONS = exports.USD_DENOMINATIONS = exports.DENOMINATIONS_TOKEN = void 0;
exports.DENOMINATIONS_TOKEN = 'DENOMINATIONS_TOKEN';
exports.USD_DENOMINATIONS = [
    { valueInCents: 10000, singular: 'hundred dollar bill', plural: 'hundred dollar bills' },
    { valueInCents: 5000, singular: 'fifty dollar bill', plural: 'fifty dollar bills' },
    { valueInCents: 2000, singular: 'twenty dollar bill', plural: 'twenty dollar bills' },
    { valueInCents: 1000, singular: 'ten dollar bill', plural: 'ten dollar bills' },
    { valueInCents: 500, singular: 'five dollar bill', plural: 'five dollar bills' },
    { valueInCents: 100, singular: 'dollar', plural: 'dollars' },
    { valueInCents: 25, singular: 'quarter', plural: 'quarters' },
    { valueInCents: 10, singular: 'dime', plural: 'dimes' },
    { valueInCents: 5, singular: 'nickel', plural: 'nickels' },
    { valueInCents: 1, singular: 'penny', plural: 'pennies' },
];
exports.EUR_DENOMINATIONS = [
    { valueInCents: 50000, singular: 'five hundred euro note', plural: 'five hundred euro notes' },
    { valueInCents: 20000, singular: 'two hundred euro note', plural: 'two hundred euro notes' },
    { valueInCents: 10000, singular: 'one hundred euro note', plural: 'one hundred euro notes' },
    { valueInCents: 5000, singular: 'fifty euro note', plural: 'fifty euro notes' },
    { valueInCents: 2000, singular: 'twenty euro note', plural: 'twenty euro notes' },
    { valueInCents: 1000, singular: 'ten euro note', plural: 'ten euro notes' },
    { valueInCents: 500, singular: 'five euro note', plural: 'five euro notes' },
    { valueInCents: 200, singular: 'two euro coin', plural: 'two euro coins' },
    { valueInCents: 100, singular: 'one euro coin', plural: 'one euro coins' },
    { valueInCents: 50, singular: 'fifty cent coin', plural: 'fifty cent coins' },
    { valueInCents: 20, singular: 'twenty cent coin', plural: 'twenty cent coins' },
    { valueInCents: 10, singular: 'ten cent coin', plural: 'ten cent coins' },
    { valueInCents: 5, singular: 'five cent coin', plural: 'five cent coins' },
    { valueInCents: 2, singular: 'two cent coin', plural: 'two cent coins' },
    { valueInCents: 1, singular: 'one cent coin', plural: 'one cent coins' },
];
exports.CURRENCY_DENOMINATIONS = {
    USD: exports.USD_DENOMINATIONS,
    EUR: exports.EUR_DENOMINATIONS,
};
//# sourceMappingURL=currency.config.js.map