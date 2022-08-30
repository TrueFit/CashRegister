import { Request, Response } from "express";

import { app } from "./app";
import { calculateChange } from "./change";
import { getCurrencyDenominations } from "./currency";
import { ChangeQueryParams } from "./interfaces";
import { ChangeResponseBody } from "../common/interfaces";

export const setupAPIController = () => {
  app.use((req, res, next) => {
    res.append("Access-Control-Allow-Origin", ["*"]);
    res.append("Access-Control-Allow-Methods", "GET");
    res.append("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

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
};
