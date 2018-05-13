using System;

namespace CashRegisterLib
{
    public class CashTransaction
    {
        public readonly decimal TotalCost;
        public readonly decimal AmountTendered;
        public readonly decimal ChangeDue;

        public CashTransaction(decimal totalCost, decimal amountTendered)
        {
            if(totalCost < 0)
            {
                throw new ArgumentException("Total cost must be greater than or equal to 0");
            }

            if (amountTendered < totalCost)
            {
                throw new ArgumentException("Amount tendered must be greater than or equal to total cost");
            }

            TotalCost = totalCost;
            AmountTendered = amountTendered;
            ChangeDue = amountTendered - totalCost;
        }

        public string GetChangeDue(IChangeCalculator changeCalculator)
        {
            return changeCalculator.GetChangeOutput(ChangeDue).ToString();
        }
    }
}
