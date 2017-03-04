using ModelObjects;
using System.Collections.Generic;

namespace ChangeCalculator
{
    public interface ICalculator
    {
        ChangeSummary GetChange(decimal cost, decimal received);
    }
}