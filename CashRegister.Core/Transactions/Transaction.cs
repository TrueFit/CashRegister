using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Interfaces.Transactions;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// Transaction Factory Container
    /// </summary>
    public class Transaction
    {
        private readonly Dictionary<Layouts, TransactionFactory> factories;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="till">A Till Factory Container</param>
        private Transaction(Till till)
        {
            factories = new Dictionary<Layouts, TransactionFactory>();

            foreach (Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (TransactionFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Transactions." + Enum.GetName(typeof(Layouts), layout) + "TransactionFactory"), till);
                factories.Add(layout, factory);
            }
        }

        /// <summary>
        /// Static constructor method
        /// </summary>
        /// <returns>A Transaction factory container</returns>
        public static Transaction InitializeFactories(Till till) => new Transaction(till);

        /// <summary>
        /// Call factory creation for given denomination layout
        /// </summary>
        /// <param name="layout">Denomination layout</param>
        /// <param name="amountOwed">Amount owed in transaction</param>
        /// <param name="amountReceived">Amount received in transaction</param>
        /// <returns>A transaction</returns>
        public ITransaction ExecuteCreation(Layouts layout, double amountOwed, double amountReceived) => factories[layout].Create(amountOwed, amountReceived);
    }
}
