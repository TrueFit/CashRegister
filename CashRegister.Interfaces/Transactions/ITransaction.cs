using CashRegister.Interfaces.Tills;

namespace CashRegister.Interfaces.Transactions
{
    /// <summary>
    /// Transaction interface
    /// </summary>
    public interface ITransaction
    {
        double Owed { get; }
        double Received { get; }
        ITill Change { get; }

        void Calculate();

        string ToString();
    }
}
