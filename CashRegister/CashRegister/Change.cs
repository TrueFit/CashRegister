using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public class ChangeMaker
    {
        private Currencies curr;

        public ChangeMaker()
        {
            curr = new Currencies();
        }

        public Currencies currencies
        {
            get
            {
                return curr;
            }
        }

        public void ClearCurrencies()
        {
            curr.Clear();
        }

        public void AddDefaultCurrencies()
        {
            curr.CreateDefaultCurrencies();            
            curr.Add(new Currency("fifty", "fifties", 50m));  // example of adding user currency
        }

        public void AddCurrency(Currency currency)
        {
            curr.Add(currency);
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
            if (change == 0)
            {
                return "No Change.";
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
            Dictionary<Currency, int> results = new Dictionary<Currency, int>();

            string result = "";
            int rndCurrency;
            int rndValue;

            while (change > 0)
            {
                // list all currencies and remove any that are too large to be useful
                RemoveLargeCurrencies(currencyRemaining, change);

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

            // put these in order, no guarantee that results is actually ordered largest -> smallest
            var sortedResults = from entry in results orderby entry.Key.value descending select entry;

            foreach (KeyValuePair<Currency, int> kvp in sortedResults)
            {
                if (result.Length > 0) result += ",";
                result += kvp.Value + " " + kvp.Key.Name(kvp.Value);

            }
            return result;
        }

        private void RemoveLargeCurrencies(List<Currency> currencies, decimal change)
        {
            List<Currency> currencyRemove = new List<Currency>();
            foreach (Currency currency in currencies)
            {
                if (currency.value > change)
                {
                    currencyRemove.Add(currency);
                }
            }

            foreach (Currency currency in currencyRemove)
            {
                currencies.Remove(currency);
            }
            currencyRemove.Clear();
        }
    }
}
