using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Interfaces.Tills;
using System;
using System.Collections.Generic;

namespace CashRegister.Core.Tills
{
    /// <summary>
    /// Till Factory Container
    /// </summary>
    public class Till
    {
        private readonly Dictionary<Layouts, TillFactory> factories;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="bank">A Bank Factory Container</param>
        private Till(Bank bank)
        {
            factories = new Dictionary<Layouts, TillFactory>();

            foreach(Layouts layout in Enum.GetValues(typeof(Layouts)))
            {
                var factory = (TillFactory)Activator.CreateInstance(Type.GetType("CashRegister.Core.Tills." + Enum.GetName(typeof(Layouts), layout) + "TillFactory"), bank.ExecuteCreation(layout));
                factories.Add(layout, factory);
            }
        }

        /// <summary>
        /// Static constructor method
        /// </summary>
        /// <param name="bank">A Bank Factory Container</param>
        /// <returns>A Till Factory Container</returns>
        public static Till InitializeFactories(Bank bank) => new Till(bank);

        /// <summary>
        /// Call Till creation for given denomination layout
        /// </summary>
        /// <param name="layout">Denomination layout</param>
        /// <param name="randomize">An optional argument signifying if the denomination order should be randomized</param>
        /// <returns>A till</returns>
        public ITill ExecuteCreation(Layouts layout, bool randomize = false) => factories[layout].Create(randomize);
    }
}