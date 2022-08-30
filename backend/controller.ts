import { Request, Response } from "express";

import { app } from "./app";
import { calculateChange } from "./change";
import { getCurrencyDenominations } from "./currency";
import { ChangeQueryParams, ChangeResponseBody } from "./interfaces";

export const setupAPIController = () => {
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
