using CashRegister.Core.Tills;
using CashRegister.Interfaces.Transactions;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// Factory for US Denomination Transactions
    /// </summary>
    public class USTransactionFactory : TransactionFactory
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="t">Till Factory Container</param>
        public USTransactionFactory(Till t) : base(t) { }

        /// <summary>
        /// Create USTransaction
        /// </summary>
        /// <param name="amountOwed">The amount owed in the transaction</param>
        /// <param name="amountReceived">The amount recieved in the transaction</param>
        /// <returns>USTransaction</returns>
        public override ITransaction Create(double amountOwed, double amountReceived) => new USTransaction(amountOwed, amountReceived, till);
    }
}
