using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Interfaces.Tills;
using CashRegister.Interfaces.Transactions;
using System;
using System.Linq;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// A Transaction that takes a US amount owed and received, then calculates the change stored in the till
    ///     - If the amount owed is divisible by 3, the till denominations are randomized
    /// </summary>
    public class USTransaction : ITransaction
    {
        public USTransaction(double amountOwed, double amountReceived, Till t)
        {
            Owed = amountOwed;
            Received = amountReceived;

            bool randomize = false;

            double divided = Math.Truncate((Owed / 3.00) * 1000.00) / 1000.00;
            // If the divided value is smaller than a penny, it isn't divisible by 3
            if (Math.Round(divided, 2) == divided)
            {
                randomize = true;
            }

            Change = t.ExecuteCreation(Layouts.US, randomize);
        }

        public double Owed { get; }
        public double Received { get; }
        public ITill Change { get; }

        /// <summary>
        /// Calculate the amount of each denomination needed in the till to give correct change
        /// </summary>
        public void Calculate()
        {
            double amountChange = Received - Owed;
            // Don't calculate if owed > received
            // Don't recalculate if till already has change
            if (amountChange > 0 && Change.IsEmpty())
            {
                // For each denomination, calculate the amount, store, and update the amount of change needed
                var keyList = Change.Amounts.Keys.ToList();
                foreach (var key in keyList)
                {
                    int count = key.MakeChange(amountChange);
                    Change.SetAmount(key, count);
                    amountChange = key.GetRemainder(amountChange, count);
                }
            }
        }

        /// <summary>
        /// Generate a string based on the calculated amount of change
        /// </summary>
        /// <returns>String representation of this transactiton</returns>
        public override string ToString()
        {
            // If the till is empty, the change needs to be calculated
            if (Change.IsEmpty())
            {
                Calculate();
            }

            string result = "";
            foreach (var kvp in Change.Amounts)
            {
                var count = kvp.Value;
                if (count > 0)
                {
                    // Append comma before every denomination except the first
                    if (!result.Equals("")) result += ", ";
                    result += kvp.Value + " " + kvp.Key.Name;
                }
            }

            return result;
        }
    }
}
