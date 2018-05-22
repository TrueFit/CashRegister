using System;
using System.Collections.Generic;
using System.Linq;

namespace CashRegister.Domain.SalesAggregate
{
    public interface ICashRegister
    {
        Dictionary<Denomination, int> ProcessChange(decimal owed, decimal paid);
    }

    public class CashRegister : ICashRegister
    {
        private readonly int _randomDivisor;
        private readonly IEnumerable<Denomination> _denominations;

        public CashRegister(int randomDivisor, IEnumerable<Denomination> denominations)
        {
            _randomDivisor = randomDivisor;
            _denominations = denominations;
        }

        private int CalculateMaxChange(Denomination denomination, decimal remainingAmount)
        {
            var maxChange = (int)(remainingAmount / denomination.Value);
            return maxChange;
        }

        /// <summary>
        /// Determines if change should be distributed randomly based on business logic
        /// </summary>
        private bool ShouldDistributeRandomly(decimal amountOwed, int divisor)
        {
            return amountOwed * 100 % divisor == 0;
        }

        public Dictionary<Denomination, int> ProcessChange(decimal owed, decimal paid)
        {                             
            if (owed > paid)
            {
                throw new NotImplementedException("Unable to process refunds at this time. Check back later!");
            }

            Dictionary<Denomination, int> neededChange = new Dictionary<Denomination, int>();

            decimal remainingChange = paid - owed;

            var orderedDenominations = ShouldDistributeRandomly(owed, _randomDivisor) ?
                                        _denominations.OrderBy(x => Guid.NewGuid()).ToList() :
                                        _denominations.OrderByDescending(x => x.Value).ToList();

            foreach (var denomination in orderedDenominations)
            {
                int denominationAmount = CalculateMaxChange(denomination, remainingChange);

                if (denominationAmount > 0)
                {
                    neededChange.Add(denomination, denominationAmount);
                    remainingChange = remainingChange - (denominationAmount * denomination.Value);
                    if (remainingChange == 0) break;
                }
            }

            return neededChange;
        }
    }
}
