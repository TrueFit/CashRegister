using System;
using System.Collections.Generic;

namespace CashRegister.Model.Implementation
{
    public sealed class LeastAmountOfChangeGenerator : ChangeGenerator
    {
        public LeastAmountOfChangeGenerator(IDictionary<double, int> amountOfEachUnitOfCurrency,
            IDictionary<double, string> currencyValueNameMapping)
            : base(amountOfEachUnitOfCurrency, currencyValueNameMapping)
        {
        }

        public override string Generate(double amountOwed, double amountPaid)
        {
            ResetState();

            double expectedChange = Math.Round(amountPaid - amountOwed, 2);

            foreach (double unit in GreatestToLeastUnitValues)
            {
                while (expectedChange >= unit)
                {
                    expectedChange = Math.Round(expectedChange - unit, 2);
                    IncrementUnitUsed(unit, 1);
                }
            }

            return CreateOutPutString();
        }
    }
}
