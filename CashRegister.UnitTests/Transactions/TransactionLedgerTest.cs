using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using NUnit.Framework;

namespace CashRegister.UnitTests.Transactions
{
    public class TransactionLedgerTest
    {
        private TransactionLedger transactionLedger;

        [SetUp]
        public void Setup()
        {
            var bank = Bank.InitializeFactories();
            var till = Till.InitializeFactories(bank);
            var transaction = Transaction.InitializeFactories(till);
            transactionLedger = TransactionLedger.InitializeFactories(transaction);
        }

        [Test]
        public void ExecuteCreation_USLayout()
        {
            var ledger = transactionLedger.ExecuteCreation(Layouts.US);
            Assert.AreEqual(0, ledger.Transactions.Count);
        }

        [TestCase("", 0)]
        [TestCase("1.28,2.00", 1)]
        [TestCase("7.34,10.00\n94.61,100.00", 2)]
        public void ExecuteCreation_USLayout_LedgerInput(string ledgerString, int count)
        {
            var ledger = transactionLedger.ExecuteCreation(Layouts.US, ledgerString);
            Assert.AreEqual(count, ledger.Transactions.Count);
        }
    }
}
