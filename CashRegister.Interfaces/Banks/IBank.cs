using CashRegister.Interfaces.Denominations;

namespace CashRegister.Interfaces.Banks
{
    /// <summary>
    /// Bank interface
    /// </summary>
    public interface IBank
    {
        IDenomination Retrieve(System.Enum val);
    }
}
