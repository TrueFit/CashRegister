using CashRegister.Core.Tills;
using CashRegister.Interfaces.Transactions;

namespace CashRegister.Core.Transactions
{
    public class USTransactionFactory : TransactionFactory
    {
        public USTransactionFactory(Till t) : base(t) { }

        public override ITransaction Create(double amountOwed, double amountReceived) => new USTransaction(amountOwed, amountReceived, till);
    }
}
