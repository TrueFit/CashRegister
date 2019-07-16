using CashRegister.Interfaces.Tills;

namespace CashRegister.Interfaces
{
    /// <summary>
    /// Transaction interface
    /// </summary>
    public interface ITransaction
    {
        double Owed { get; }
        double Received { get; }
        ITill Till { get; }

        void Calculate();
        string ToString();
    }
}
