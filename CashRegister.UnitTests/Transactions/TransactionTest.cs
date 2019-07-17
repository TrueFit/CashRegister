using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using NUnit.Framework;

namespace CashRegister.UnitTests.Transactions
{
    public class TransactionTest
    {
        private Transaction transaction;

        [SetUp]
        public void Setup()
        {
            var bank = Bank.InitializeFactories();
            var till = Till.InitializeFactories(bank);
            transaction = Transaction.InitializeFactories(till);
        }

        [TestCase(1.28, 2.00)]
        [TestCase(7.34, 10.00)]
        [TestCase(94.61, 100.00)]
        public void ExecuteCreation_USLayout(double amountOwed, double amountReceived)
        {
            var usTransaction = transaction.ExecuteCreation(Layouts.US, amountOwed, amountReceived);
            Assert.That(usTransaction, Is.TypeOf<USTransaction>());
            Assert.AreEqual(amountOwed, usTransaction.Owed);
            Assert.AreEqual(amountReceived, usTransaction.Received);
            Assert.IsTrue(usTransaction.Change.IsEmpty());
        }
    }
}
