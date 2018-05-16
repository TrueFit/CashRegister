using System;
using System.Linq;
using CashRegisterLib.Enum;

namespace CashRegisterLib
{
    public class RandomChangeCalculator : IChangeCalculator
    {
        public ChangeCounter GetChangeOutput(decimal changeDue)
        {
            ChangeCounter counter = new ChangeCounter();
            CurrencySet denominations = CurrencyFactory.CreateCurrencySet(CurrencyType.Usd);
            Random random = new Random();

            while (changeDue > 0)
            {
                var subset = denominations.Where(x => x.MonetaryValue <= changeDue).ToArray();
                var denom  = subset[random.Next(subset.Length)];

                counter.AddChange(denom);
                changeDue -= denom.MonetaryValue;

            }

            return counter;
        }
    }
}
