using CashRegister.Core.Enums;
using CashRegister.Interfaces.Banks;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Banks
{
    public class Bank
    {
        private Dictionary<Layouts, BankFactory> factories;

        private Bank()
        {
            factories = new Dictionary<Layouts, BankFactory>();

            foreach(Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (BankFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Banks." + Enum.GetName(typeof(Layouts), layout) + "BankFactory"));
                factories.Add(layout, factory);
            }
        }

        public static Bank InitializeFactories() => new Bank();
        public IBank ExecuteCreation(Layouts layout) => factories[layout].Create();
    }
}
