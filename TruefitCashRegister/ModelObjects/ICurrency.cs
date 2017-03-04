using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelObjects
{
    public interface ICurrency
    {
        IEnumerable<Denomination> GetCurrencyItems();
    }
}
