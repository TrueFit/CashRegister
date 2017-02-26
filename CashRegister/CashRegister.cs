using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public class CashRegister
    {
        public ITransaction Action { get; set; }

        public int DoTheThing()
        {
            return Action.PerformTransaction();
        }
    }
}
