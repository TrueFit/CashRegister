using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.CashRegisterClass
{
    class Currency
    {
        public List<CurrencyType> currency { get; set; }

        public Currency()
        {
            currency = new List<CurrencyType>();
            currency.Add(new CurrencyType("dollar", 1.00));
            currency.Add(new CurrencyType("quarters", 0.25));
            currency.Add(new CurrencyType("dimes", 0.10));
            currency.Add(new CurrencyType("nickels", 0.05));
            currency.Add(new CurrencyType("pennies", 0.01));
        }

    }


}
