using System.Collections.Generic;

namespace Interfaces
{
    public interface ICalculator
    {
        List<IChange> Calculate(decimal amountDue, decimal amountPaid);
    }
}
