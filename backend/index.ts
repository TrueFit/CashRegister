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

const getCurrencyDenominations = (
  currencyName: string
): Denomination[] | null => {
  if (currencyName in currencyDenominations) {
    const denominations: Denomination[] =
      currencyDenominations[currencyName as CurrencyKey];
    return denominations;
  } else {
    return null;
  }
};

const calculateChange = (
  paid: number,
  owed: number,
  denominations: Denomination[]
): ChangePortion[] => {
  const changePortion: ChangePortion = {
    denomination: denominations[0],
    amount: 2,
  };
  return [changePortion];
};
