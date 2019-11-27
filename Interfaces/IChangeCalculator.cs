using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interfaces
{
    public interface IChangeCalculator
    {
        IChange Calculate(decimal amountDue, decimal amountPaid);
    }
}
