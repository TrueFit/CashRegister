using CashRegister.Core.Tills;
using CashRegister.Interfaces.Transactions;

namespace CashRegister.Core.Transactions
{
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
