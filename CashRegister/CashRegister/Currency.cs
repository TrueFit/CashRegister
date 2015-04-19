using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public class Currencies
    {
        private List<Currency> _currencies;

        public Currencies()
        {
            // create currencies individually because there is no real math behind them
            // same with their pluralizations
            _currencies = new List<Currency>();

        }

        public List<Currency> currencies 
        {
            get
            {
                return _currencies;
            }
        }

        public void CreateDefaultCurrencies()
        {
            _currencies.Add(new Currency("twenty", "twenties", (decimal)20.00));
            _currencies.Add(new Currency("ten", "tens", (decimal)10.00));
            _currencies.Add(new Currency("five", "fives", (decimal)5.00));
            _currencies.Add(new Currency("one", "ones", (decimal)1.00));
            _currencies.Add(new Currency("quarter", "quarters", (decimal)0.25));
            _currencies.Add(new Currency("dime", "dimes", (decimal)0.10));
            _currencies.Add(new Currency("nickle", "nickles", (decimal)0.05));
            _currencies.Add(new Currency("penny", "pennies", (decimal)0.01));
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
