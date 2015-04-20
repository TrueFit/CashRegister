using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public class Change
    {
        private Currencies curr;

        public Change()
        {
            curr = new Currencies();
            curr.CreateDefaultCurrencies();
            curr.Add(new Currency("Fifty", "Fifties", 50m));
        }

        public string GetChange(decimal total, decimal paid)
        {
            decimal change = paid - total;
            if (change > 0)
            {
                if (decimal.Remainder(total, 0.03m) == 0)
                {
                    return GetChangeRandom(change);
                }
                else
                {
                    return GetChange(change);
                }
            }
            return "Total was more than amount paid.";
        }

        private string GetChange(decimal change)
        {
            string result = "";
            int value = 0;
            foreach (Currency c in curr.currencies)
            {
                value = (int)(change / c.value);
                change = change - ((decimal)value * c.value);
                if (value > 0)
                {   
                    // if this is not the first thing added to result, add a comma
                    if (result.Length > 0) result += ",";

                    result += value + " " + c.Name(value);
                }
            }
            return result;
        }

        private string GetChangeRandom(decimal change)
        {
            Random rnd = new Random(Guid.NewGuid().GetHashCode());
            List<Currency> currencyRemaining = new List<Currency>(curr.currencies);
            List<Currency> currencyRemove = new List<Currency>();
            Dictionary<Currency, int> results = new Dictionary<Currency, int>();

            string result = "";
            int rndCurrency;
            int rndValue;

            while (change > 0)
            {
                // list all currencies and remove any that are too large to be useful
                foreach (Currency currency in currencyRemaining)
                {
                    if (currency.value > change)
                    {
                        currencyRemove.Add(currency);
                    }
                }
                
                foreach (Currency currency in currencyRemove)
                {
                    currencyRemaining.Remove(currency);
                }
                currencyRemove.Clear();

                rndCurrency = rnd.Next(currencyRemaining.Count);
                rndValue = rnd.Next((int)(change / currencyRemaining[rndCurrency].value));
                if (rndValue == 0) rndValue = 1; // don't waste time going through iterations that don't actually change the value

                if (results.ContainsKey(currencyRemaining[rndCurrency]))
                {
                    results[currencyRemaining[rndCurrency]] += rndValue;
                }
                else
                {
                    results.Add(currencyRemaining[rndCurrency], rndValue);
                }

                change -= currencyRemaining[rndCurrency].value * rndValue;

            }

            // put these in order, no guarantee that this is actually ordered largest -> smallest
            foreach (KeyValuePair<Currency, int> kvp in results)
            {
                if (result.Length > 0) result += ",";
                result += kvp.Value + " " + kvp.Key.Name();

            }
            return result;
        }
    }
}
