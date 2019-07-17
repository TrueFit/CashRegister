using CashRegister.Core.Enums;
using CashRegister.Interfaces.Transactions;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// TransactionLedger Factory Container
    /// </summary>
    public class TransactionLedger
    {
        private readonly Dictionary<Layouts, TransactionLedgerFactory> factories;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="transaction">A Transaction Factory Container</param>
        private TransactionLedger(Transaction transaction)
        {
            factories =  new Dictionary<Layouts, TransactionLedgerFactory>();

            foreach (Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (TransactionLedgerFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Transactions." + Enum.GetName(typeof(Layouts), layout) + "TransactionLedgerFactory"), transaction);
                factories.Add(layout, factory);
            }
        }

        /// <summary>
        /// Static constructor method
        /// </summary>
        /// <param name="transaction">Transaction Factory Container</param>
        /// <returns>TranscationLedger Factory Container</returns>
        public static TransactionLedger InitializeFactories(Transaction transaction) => new TransactionLedger(transaction);

        /// <summary>
        /// Call factory creating for given denomination layout
        /// </summary>
        /// <param name="layout">Denomination layout</param>
        /// <returns>A TransactionLedger</returns>
        public ITransactionLedger ExecuteCreation(Layouts layout) => factories[layout].Create();

        /// <summary>
        /// Call factory creating for given denomination layout
        /// </summary>
        /// <param name="layout">Denomination layout</param>
        /// <param name="ledger">A string containing ledger entries / transactions</param>
        /// <returns></returns>
        public ITransactionLedger ExecuteCreation(Layouts layout, string ledger) => factories[layout].Create(ledger);
    }
}
