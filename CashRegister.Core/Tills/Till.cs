using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Interfaces.Tills;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Tills
{
    public class Till
    {
        private readonly Dictionary<Layouts, TillFactory> factories;

        private Till(Bank bank)
        {
            factories = new Dictionary<Layouts, TillFactory>();

            foreach(Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (TillFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Tills." + Enum.GetName(typeof(Layouts), layout) + "TillFactory"), bank.ExecuteCreation(layout));
                factories.Add(layout, factory);
            }
        }

        public static Till InitializeFactories(Bank bank) => new Till(bank);
        public ITill ExecuteCreation(Layouts layout, bool randomize = false) => factories[layout].Create(randomize);
    }
}