using CashRegister.Core.Enums;
using CashRegister.Interfaces.Banks;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Banks
{
    /// <summary>
    /// Bank Factory Container
    /// </summary>
    public class Bank
    {
        private Dictionary<Layouts, BankFactory> factories;

        /// <summary>
        /// Constructor
        /// </summary>
        private Bank()
        {
            factories = new Dictionary<Layouts, BankFactory>();

            foreach(Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (BankFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Banks." + Enum.GetName(typeof(Layouts), layout) + "BankFactory"));
                factories.Add(layout, factory);
            }
        }

        /// <summary>
        /// Static constructor method
        /// </summary>
        /// <returns>A Bank factory container</returns>
        public static Bank InitializeFactories() => new Bank();

        /// <summary>
        /// Call factory creation for given denomination layout
        /// </summary>
        /// <param name="layout">Denomination layout</param>
        /// <returns>A bank</returns>
        public IBank ExecuteCreation(Layouts layout) => factories[layout].Create();
    }
}
