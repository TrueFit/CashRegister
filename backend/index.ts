import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  ChangeQueryParams,
  ChangePortion,
  Denomination,
  ChangeResponseBody,
} from "./interfaces";

import currencyDenominations from "./configuration/currencyDenominations.json";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

type CurrencyKey = keyof typeof currencyDenominations;

app.get(
  "/change",
  (
    req: Request<{}, {}, {}, ChangeQueryParams>,
    res: Response<ChangeResponseBody>
  ) => {
    const { paid, owed, currency } = req.query;

    const denominations = getCurrencyDenominations(currency);

    if (denominations !== null) {
      const change = calculateChange(paid, owed, denominations);
      res.send({ change });
    } else {
      res.sendStatus(404);
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

/**
 * Looks up the currency by name and returns the currency denominations that it's comprised of.
 * @param currencyName The name of the currency, e.g. "USD"
 * @returns A list of denominations, sorted by value descending.
 */
const getCurrencyDenominations = (
  currencyName: string
): Denomination[] | null => {
  if (currencyName in currencyDenominations) {
    const denominations: Denomination[] =
      currencyDenominations[currencyName as CurrencyKey];
    denominations.sort((a, b) => b.value - a.value);
    return denominations;
  } else {
    return null;
  }
};

/**
 * Calculate the denominations and amounts needed to make change
 * @param paid Amount paid, in dollars
 * @param owed Amount owed, in dollars
 * @param denominations List of available currency denominations to make change with, sorted by value descending.
 * @returns A list of ChangePortions, sorted by denomination value descending.
 */
const calculateChange = (
  paid: number,
  owed: number,
  denominations: Denomination[]
): ChangePortion[] => {
  const changePortions: ChangePortion[] = [];

  // Work with cents (integers) instead of dollars to avoid floating-point weirdness (0.1 + 0.2 != 0.3)
  const paidCents = paid * 100;
  const owedCents = owed * 100;
  const targetChangeValue = paidCents - owedCents;
  let currentChangeValue = 0;

  if (owedCents % 3 === 0) {
    // Random change
    while (currentChangeValue !== targetChangeValue) {
      const remainingDifference = targetChangeValue - currentChangeValue;
      const availableDenominations = denominations.filter(
        (d) => d.value <= remainingDifference
      );
      const randomDenomination =
        availableDenominations[
          Math.floor(Math.random() * availableDenominations.length)
        ];

      const currentChangePortion = changePortions.find(
        (c) => c.denomination === randomDenomination
      );

      if (currentChangePortion !== undefined) {
        currentChangePortion.amount++;
      } else {
        changePortions.push({ denomination: randomDenomination, amount: 1 });
      }
      currentChangeValue += randomDenomination.value;
    }
    changePortions.sort((a, b) => b.denomination.value - a.denomination.value);
  } else {
    // Minimum physical change
    for (let i = 0; i < denominations.length; i++) {
      const currentDenomination = denominations[i];
      const currentChangePortion: ChangePortion = {
        denomination: currentDenomination,
        amount: 0,
      };

      while (
        currentChangeValue + currentDenomination.value <=
        targetChangeValue
      ) {
        currentChangePortion.amount++;
        currentChangeValue += currentDenomination.value;
      }

      if (currentChangePortion.amount > 0) {
        changePortions.push(currentChangePortion);
      }

      if (currentChangeValue === targetChangeValue) {
        break;
      }
    }
  }

  return changePortions;
};
