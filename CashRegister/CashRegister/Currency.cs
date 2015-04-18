using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public class Currencies
    {
        public List<Currency> currencies;

        public Currencies()
        {
            // create currencies individually because there is no real math behind them
            // same with their pluralizations
            currencies = new List<Currency>();

        }

        public void CreateDefaultCurrencies()
        {
            currencies.Add(new Currency("Twenty", "Twenties", (decimal)20.00));
            currencies.Add(new Currency("Ten", "Tens", (decimal)10.00));
            currencies.Add(new Currency("Five", "Fives", (decimal)5.00));
            currencies.Add(new Currency("One", "Ones", (decimal)1.00));
            currencies.Add(new Currency("Quarter", "Quarters", (decimal)0.25));
            currencies.Add(new Currency("Dime", "Dimes", (decimal)0.10));
            currencies.Add(new Currency("Nickle", "Nickles", (decimal)0.05));
            currencies.Add(new Currency("Penny", "Pennies", (decimal)0.01));
        }
    }
    public class Currency
    {
        public string name { get; set; }
        public string plural { get; set; }
        public decimal value { get; set; }

        public Currency(string Name, string Plural, decimal Value)
        {
            name = Name;
            plural = Plural;
            value = Value;
        }

    }
}
