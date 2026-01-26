// Currency definitions - structured to easily add EUR, GBP, etc.

import type { CurrencySystem, Denomination } from "./types";

// USD denominations ordered largest to smallest for greedy algorithm
const usdDenominations: Denomination[] = [
  {
    name: "dollar",
    pluralName: "dollars",
    valueInCents: 100,
    type: "bill",
  },
  {
    name: "quarter",
    pluralName: "quarters",
    valueInCents: 25,
    type: "coin",
  },
  {
    name: "dime",
    pluralName: "dimes",
    valueInCents: 10,
    type: "coin",
  },
  {
    name: "nickel",
    pluralName: "nickels",
    valueInCents: 5,
    type: "coin",
  },
  {
    name: "penny",
    pluralName: "pennies",
    valueInCents: 1,
    type: "coin",
  },
];

export const USD: CurrencySystem = {
  code: "USD",
  symbol: "$",
  denominations: usdDenominations,
};

export const DEFAULT_CURRENCY = USD;
