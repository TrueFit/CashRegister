using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    class RegisterTransaction
    {
        public decimal total { get; set; }
        public decimal paid { get; set; }
        public string change { get; set; }
    }
}
