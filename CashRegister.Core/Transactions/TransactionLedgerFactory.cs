using CashRegister.Interfaces.Tills;
using CashRegister.Interfaces.Transactions;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// Abstract TransactionLedgerFactory
    /// </summary>
    public abstract class TransactionLedgerFactory
    {
        protected Transaction transaction;

        public TransactionLedgerFactory(Transaction trans)
        {
            transaction = trans;
        }

        public abstract ITransactionLedger Create();
        public abstract ITransactionLedger Create(string ledger);
    }
}
