using CashRegister.Interfaces.Transactions;

namespace CashRegister.Core.Transactions
{
    /// <summary>
    /// Factory for US Denomination Transaction Ledger
    /// </summary>
    public class USTransactionLedgerFactory : TransactionLedgerFactory
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="t">A Transaction Factory Container</param>
        public USTransactionLedgerFactory(Transaction t) : base(t) { }

        /// <summary>
        /// Create a USTransactionLedger
        /// </summary>
        /// <returns>USTransactionLedger</returns>
        public override ITransactionLedger Create() => new USTransactionLedger(transaction);

        /// <summary>
        /// Create A USTransactionLedger
        /// </summary>
        /// <param name="ledger">A string of ledger entries / transactions</param>
        /// <returns></returns>
        public override ITransactionLedger Create(string ledger) => new USTransactionLedger(ledger, transaction);
    }
}
