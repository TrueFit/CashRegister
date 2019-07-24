using System;
using CashRegister.Model.Interfaces;

namespace CashRegister.Model.Implementation
{
    internal class ChangeGeneratorFactory : IChangeGeneratorFactory
    {
        public IChangeGenerator Create(ISettings settings)
        {
            if (IsRandomChangeGeneratorNeeded(settings.AmountOwed, settings.DivisorForRandomChange))
                return ModelLocator.RandomChangeGenerator;

            return ModelLocator.LeastAmountOfChangeGenerator;
        }

        private bool IsRandomChangeGeneratorNeeded(double amountOwed, int divisor)
        {
            int truncatedAmountOwed = Convert.ToInt32(amountOwed);
            bool isAmountOwedWholeNumber = amountOwed.Equals(Convert.ToDouble(truncatedAmountOwed));
            
            return isAmountOwedWholeNumber && divisor > 0 && truncatedAmountOwed % divisor == 0;
        }
    }
}
