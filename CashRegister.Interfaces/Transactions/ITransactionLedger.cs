using System.Collections.Generic;

namespace CashRegister.Interfaces.Transactions
{
    /// <summary>
    /// TransactionLedger interface
    /// </summary>
    public interface ITransactionLedger
    {
        List<ITransaction> Transactions { get; }

        void Load(string ledger);

        void Clear();

        void Calculate();

        string ToString();
    }
}
