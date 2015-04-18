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
            
            return GetChange(paid - total);
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
                    if (value > 1)
                    { currencyName = c.plural; }
                    else
                    { currencyName = c.name; }
                    if (result.Length > 0) result += ",";
                    result += value + " " + currencyName;
                }
            }
            return result;
        }

        private string GetChangeRandom(decimal change)
        {
            return "";
        }
    }
}
