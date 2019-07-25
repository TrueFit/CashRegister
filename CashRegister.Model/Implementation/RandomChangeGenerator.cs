using System;
using System.Collections.Generic;

namespace CashRegister.Model.Implementation
{
    public class RandomChangeGenerator : ChangeGenerator
    {
        public RandomChangeGenerator(IDictionary<double, int> amountOfEachUnitOfCurrency,
            IDictionary<double, string> currencyValueNameMapping,
            IDictionary<string, string> pluralCurrencyUnitNames)
            : base(amountOfEachUnitOfCurrency, currencyValueNameMapping, pluralCurrencyUnitNames)
        {
        }

        public override string Generate(double amountOwed, double amountPaid)
        {
            ResetCountOfUnitsUsed();

            double expectedChange = Math.Round(amountPaid - amountOwed, 2);

            int numberOfKeys = GreatestToLeastUnitValues.Count;
            Random rand = new Random();

            while (expectedChange > 0)
            {
                var currentKeyIndex = rand.Next(0, numberOfKeys);
                var unit = GreatestToLeastUnitValues[currentKeyIndex];

                if (expectedChange >= unit)
                {
                    expectedChange = Math.Round(expectedChange - unit, 2);
                    IncrementUnitUsed(unit, 1);
                }
            }

            return CreateOutputString();
        }
    }
}
