using System;
using System.Linq;

namespace CashRegisterLib
{
    public class RandomChangeCalculator : IChangeCalculator
    {
        public ChangeCounter GetChangeOutput(decimal changeDue)
        {
            ChangeCounter counter = new ChangeCounter();
            USDDenominations denominations = new USDDenominations();
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
