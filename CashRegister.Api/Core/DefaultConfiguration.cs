using CashRegister.Domain.SalesAggregate;
using System.Collections.Generic;

namespace CashRegister.Api.Core
{
    /// <summary>
    /// Provides sensible USD defaults if no configuration is provided for cash register
    /// </summary>
    public class DefaultConfiguration
    {
        public static List<Denomination> Denominations =>
            new List<Denomination>()
            {
                new Denomination { Value = 100.00m, NameSingular = "Hundred", NamePlural = "Hundreds" },
                new Denomination { Value = 50.00m, NameSingular = "Fifty", NamePlural = "Fifties" },
                new Denomination { Value = 20.00m, NameSingular = "Twenty", NamePlural = "Twenties" },
                new Denomination { Value = 10.00m, NameSingular = "Ten", NamePlural = "Tens" },
                new Denomination { Value = 5.00m, NameSingular = "Five", NamePlural = "Fives" },
                new Denomination { Value = 1.00m, NameSingular = "Dollar", NamePlural = "Dollars" },
                new Denomination { Value = 0.25m, NameSingular = "Quarter", NamePlural = "Quarters" },
                new Denomination { Value = 0.10m, NameSingular = "Dime", NamePlural = "Dimes" },
                new Denomination { Value = 0.05m, NameSingular = "Nickel", NamePlural = "Nickels" },
                new Denomination { Value = 0.01m, NameSingular = "Penny", NamePlural = "Pennies" }
            };

        public static string CurrencySymbol => "$";
        public static int Divisor => 3;
    }
}
