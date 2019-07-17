using CashRegister.Core.Enums;
using CashRegister.Interfaces.Transactions;
using System.Collections.Generic;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// A TransactionLedger that manages a Transaction for US Denominations
    /// </summary>
    public class USTransactionLedger : ITransactionLedger
    {
        private Transaction transactionFactory;
        private char delimeter;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="transaction">A Transaction Factory Container</param>
        public USTransactionLedger(Transaction transaction)
        {
            transactionFactory = transaction;
            delimeter = ',';
            Transactions = new List<ITransaction>();
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="ledger">A string of ledger entries / transactions</param>
        /// <param name="transaction">A Transaction Factory Container</param>
        public USTransactionLedger(string ledger, Transaction transaction)
        {
            transactionFactory = transaction;
            delimeter = ',';
            Transactions = new List<ITransaction>();

            Load(ledger);
        }

        /// <summary>
        /// Auto-property for list of transactions
        /// </summary>
        public List<ITransaction> Transactions { get; }

        /// <summary>
        /// Calculates all transactions within the ledger
        /// </summary>
        public void Calculate()
        {
            foreach (ITransaction transaction in Transactions)
            {
                transaction.Calculate();
            }
        }

        /// <summary>
        /// Clears the ledger of all transactions
        /// </summary>
        public void Clear()
        {
            Transactions.Clear();
        }

        /// <summary>
        /// Calculates all transactions within the ledger
        /// </summary>
        public void Load(string ledger)
        {
            var transactionStrings = ledger.Split('\n');
            foreach (var transaction in transactionStrings)
            {
                // If transaction string is empty, add a new Transaction
                if (!transaction.Equals(""))
                {
                    var amounts = transaction.Split(delimeter);
                    double owed = double.Parse(amounts[0], System.Globalization.CultureInfo.InvariantCulture);
                    double received = double.Parse(amounts[1], System.Globalization.CultureInfo.InvariantCulture);
                    Transactions.Add(transactionFactory.ExecuteCreation(Layouts.US, owed, received));
                }
            }
        }

        /// <summary>
        /// Generates a string of all transactions within the ledger
        /// </summary>
        /// <returns>String representation of all transactions</returns>
        public override string ToString()
        {
            string result = "";
            foreach (ITransaction transaction in Transactions)
            {
                var transactionStr = transaction.ToString();
                if (transactionStr.Equals(""))
                {
                    result += "No change due\n";
                }
                else
                {
                    result += transactionStr + "\n";
                }
            }
            return result;
        }
    }
}
