using System;
using CashRegister.Model.Interfaces;

namespace CashRegister.Model.Implementation
{
    internal class ChangeGeneratorFactory : IChangeGeneratorFactory
    {
        public IChangeGenerator Create(ISettings settings)
        {
            if (IsRandomChangeGeneratorNeeded(settings.AmountOwed, settings.DivisorForRandomChange))
                return ModelContainer.RandomChangeGenerator;

            return ModelContainer.LeastAmountOfChangeGenerator;
        }

        private bool IsRandomChangeGeneratorNeeded(double amountOwed, int divisor)
        {
            if (divisor == 0) return false;

            // since we are rounding to two decimal places, this product will always be an integer
            int productAsInteger = Convert.ToInt32(Math.Round(amountOwed, 2) * 100);

            return productAsInteger % divisor == 0;
        }
    }
}
