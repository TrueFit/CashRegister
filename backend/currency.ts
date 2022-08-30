import currencyDenominations from "./configuration/currencyDenominations.json";
import { Denomination } from "./interfaces";

type CurrencyKey = keyof typeof currencyDenominations;

/**
 * Looks up the currency by name and returns the currency denominations that it's comprised of.
 * @param currencyName The name of the currency, e.g. "USD"
 * @returns A list of denominations, sorted by value descending.
 */
export const getCurrencyDenominations = (
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
