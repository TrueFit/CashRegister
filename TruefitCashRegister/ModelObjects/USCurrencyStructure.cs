using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelObjects
{
    public class USCurrencyStructure : ICurrency
    {
        public IEnumerable<Denomination> GetCurrencyItems()
        {
            return new List<Denomination>
            {
                new Denomination { Name = "Hundred", Value = 100.00M },
                new Denomination { Name = "Fifty", Value = 50.00M },
                new Denomination { Name = "Twenty", Value = 20.00M },
                new Denomination { Name = "Ten", Value = 10.00M },
                new Denomination { Name = "Five", Value = 5.00M },
                new Denomination { Name = "One", Value = 1.00M },
                new Denomination { Name = "Quarter", Value = 0.25M },
                new Denomination { Name = "Dime", Value = 0.10M },
                new Denomination { Name = "Nickle", Value = 0.05M },
                new Denomination { Name = "Penny", Value = 0.01M }
            };
        }
    }
}
