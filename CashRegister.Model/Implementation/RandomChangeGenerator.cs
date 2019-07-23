using System;
using System.Collections.Generic;

namespace CashRegister.Model.Implementation
{
    public class RandomChangeGenerator : ChangeGenerator
    {
        public RandomChangeGenerator(IDictionary<double, int> amountOfEachUnitOfCurrency,
            IDictionary<double, string> currencyValueNameMapping) : base(amountOfEachUnitOfCurrency,
            currencyValueNameMapping)
        {
        }

        public override string Generate(double amountOwed, double amountPaid)
        {
            throw new NotImplementedException();
        }
    }
}
