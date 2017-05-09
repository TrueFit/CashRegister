using CashRegister.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.Services
{
    public class ChangeService : IChangeService
    {
        public int CalculateChange(decimal totalCost, decimal amountPaid)
        {
            var totalCostInCents = decimal.ToInt32(totalCost * 100);
            var amountPaidInCents = decimal.ToInt32(amountPaid * 100);
            var totalChangeInCents = amountPaidInCents - totalCostInCents;

            if (totalChangeInCents < 0) throw new Exception("Customer did not pay enough to cover amount due.");

            return totalChangeInCents;        
        }

        public string ConvertChangeToDenominations(int changeInCents, bool useRandom)
        {
            var changeDenominationService = new ChangeDenominationService();

            if (useRandom)
                return changeDenominationService.CalculateRandomChangeDenominations(changeInCents);

            return changeDenominationService.CalculateStandardChangeDenominations(changeInCents);
        }
    }
}
