using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public interface ITransaction
    {
        int Cost { get; set; }
        int AmountPaid { get; set; }
        int PerformTransaction();
    }
}
