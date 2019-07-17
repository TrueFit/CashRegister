using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using NUnit.Framework;

namespace CashRegister.UnitTests.Transactions
{
    public class USTranscationLedgerFactoryTest
    {
        private USTransactionLedgerFactory transactionLedger;

        [SetUp]
        public void Setup()
        {
            var bank = Bank.InitializeFactories();
            var till = Till.InitializeFactories(bank);
            var transaction = Transaction.InitializeFactories(till);
            transactionLedger = new USTransactionLedgerFactory(transaction);
        }

        [Test]
        public void Create()
        {
            var ledger = transactionLedger.Create();
            Assert.AreEqual(0, ledger.Transactions.Count);
        }

        [TestCase("\n", 0)]
        [TestCase("1.28,2.00", 1)]
        [TestCase("7.34,10.00\n94.61,100.00", 2)]
        public void Create_LedgerInput(string ledgerString, int count)
        {
            var ledger = transactionLedger.Create(ledgerString);
            Assert.AreEqual(count, ledger.Transactions.Count);
        }
    }
}
