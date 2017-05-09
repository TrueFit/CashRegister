using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.Objects
{
    public class ChangeDenomination
    {
        public string SingularName { get; set; }
        public string PluralName { get; set; }
        public int ValueInCents { get; set; }
        public int Index { get; set; }
    }
}
