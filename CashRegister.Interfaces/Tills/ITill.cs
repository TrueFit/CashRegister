using CashRegister.Interfaces.Denominations;
using System.Collections.Generic;

namespace CashRegister.Interfaces.Tills
{
    /// <summary>
    /// Till interface
    /// </summary>
    public interface ITill
    {
        Dictionary<IDenomination, int> Amounts { get; }

        void SetAmount(IDenomination denom, int count);
        bool IsEmpty();
    }
}
