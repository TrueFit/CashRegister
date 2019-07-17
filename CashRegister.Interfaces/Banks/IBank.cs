using CashRegister.Interfaces.Denominations;
using System.Collections.Generic;

namespace CashRegister.Interfaces.Banks
{
    /// <summary>
    /// Bank interface
    /// </summary>
    public interface IBank
    {
        List<IDenomination> Denominations { get; }

        IDenomination Retrieve(System.Enum val);
    }
}
