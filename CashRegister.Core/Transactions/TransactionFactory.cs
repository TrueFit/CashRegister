using CashRegister.Core.Tills;
using CashRegister.Interfaces.Transactions;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// Abstract TransactionFactory
    /// </summary>
    public abstract class TransactionFactory
    {
        protected Till till;

        public TransactionFactory(Till t)
        {
            till = t;
        }

        public abstract ITransaction Create(double amountOwed, double amountReceived);
    }
}
