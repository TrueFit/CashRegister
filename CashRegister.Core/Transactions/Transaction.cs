using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Interfaces.Transactions;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Transactions
{
    public class Transaction
    {
        private readonly Dictionary<Layouts, TransactionFactory> factories;

        private Transaction(Till till)
        {
            factories = new Dictionary<Layouts, TransactionFactory>();

            foreach (Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (TransactionFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Transactions." + Enum.GetName(typeof(Layouts), layout) + "TransactionFactory"), till);
                factories.Add(layout, factory);
            }
        }

        public static Transaction InitializeFactories(Till till) => new Transaction(till);
        public ITransaction ExecuteCreation(Layouts layout, double amountOwed, double amountReceived) => factories[layout].Create(amountOwed, amountReceived);
    }
}
