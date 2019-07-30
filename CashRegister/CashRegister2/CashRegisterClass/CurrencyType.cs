using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.CashRegisterClass
{
    class CurrencyType
    {
        public string currencyType { get; set; }
        public decimal currencyValue { get; set; }
        public int count { get; set; }

        public CurrencyType()
        {

        }

        public CurrencyType(string type, double value)
        {
            currencyType = type;
            currencyValue = Convert.ToDecimal(value);
            count = 0;
        }
    }
}
