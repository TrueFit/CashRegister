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
        }

        public string GetChange(decimal total, decimal paid)
        {
            decimal change = paid - total;
            if (decimal.Remainder(total, 0.03m) == 0)
            {
                return GetChangeRandom(change);
            }
            else
            {
                return GetChange(change);
            }
        }

        private string GetChange(decimal change)
        {
            string result = "";
            string currencyName = "";
            int value = 0;
            foreach (Currency c in curr.currencies)
            {
                value = (int)(change / c.value);
                change = change - ((decimal)value * c.value);
                if (value > 0)
                {   
                    // choose either singular or plural version
                    if (value > 1)
                    { currencyName = c.plural; }
                    else
                    { currencyName = c.name; }

                    // if this is not the first thing added to result, add a comma
                    if (result.Length > 0) result += ",";

                    result += value + " " + currencyName;
                }
            }
            return result;
        }

        private string GetChangeRandom(decimal change)
        {
            return "Random Change";
        }
    }
}
