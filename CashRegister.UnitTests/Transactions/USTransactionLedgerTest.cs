using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using NUnit.Framework;

namespace CashRegister.UnitTests.Transactions
{
    public class USTransactionLedgerTest
    {
        private TransactionLedger transactionLedgerFactory;

        [SetUp]
        public void Setup()
        {
            var bankFactory = Bank.InitializeFactories();
            var tillFactory = Till.InitializeFactories(bankFactory);
            var transactionFactory = Transaction.InitializeFactories(tillFactory);
            transactionLedgerFactory = TransactionLedger.InitializeFactories(transactionFactory);
        }

        [TestCase("\n", 0)]
        [TestCase("1.28,2.00", 1)]
        [TestCase("7.34,10.00\n94.61,100.00", 2)]
        public void Transactions(string ledgerString, int count)
        {
            var transactionLedger = transactionLedgerFactory.ExecuteCreation(Layouts.US, ledgerString);
            Assert.AreEqual(count, transactionLedger.Transactions.Count);

        }

        [TestCase("\n", 0)]
        [TestCase("1.28,2.00", 1)]
        [TestCase("7.34,10.00\n94.61,100.00", 2)]
        public void Load(string ledgerString, int count)
        {
            var transactionLedger = transactionLedgerFactory.ExecuteCreation(Layouts.US);
            transactionLedger.Load(ledgerString);

            Assert.AreEqual(count, transactionLedger.Transactions.Count);
        }

        [Test]
        public void Clear()
        {
            string ledgerString = "7.34,10.00\n94.61,100.00";

            var transactionLedger = transactionLedgerFactory.ExecuteCreation(Layouts.US);
            transactionLedger.Load(ledgerString);

            Assert.AreEqual(2, transactionLedger.Transactions.Count);

            transactionLedger.Clear();

            Assert.AreEqual(0, transactionLedger.Transactions.Count);
        }

        [TestCase("\n", "")]
        [TestCase("1.28,2.00", "2 quarter, 2 dime, 2 penny\n")]
        [TestCase("7.34,10.00\n94.61,100.00", "2 dollar, 2 quarter, 1 dime, 1 nickel, 1 penny\n5 dollar, 1 quarter, 1 dime, 4 penny\n")]
        public void Calculate(string ledgerString, string changeString)
        {
            var transactionLedger = transactionLedgerFactory.ExecuteCreation(Layouts.US);
            transactionLedger.Load(ledgerString);

            transactionLedger.Calculate();
            var calculatedString = transactionLedger.ToString();

            Assert.AreEqual(changeString, calculatedString);
        }
    }
}
