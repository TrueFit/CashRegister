using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using NUnit.Framework;

namespace CashRegister.UnitTests.Transactions
{
    public class USTransactionFactoryTest
    {
        private USTransactionFactory usTransactionFactory;

        [SetUp]
        public void Setup()
        {
            var bankFactory = Bank.InitializeFactories();
            var tillFactory = Till.InitializeFactories(bankFactory);
            usTransactionFactory = new USTransactionFactory(tillFactory);
        }

        [TestCase(1.28, 2.00)]
        [TestCase(7.34, 10.00)]
        [TestCase(94.61, 100.00)]
        public void Create(double amountOwed, double amountReceived)
        {
            var transaction = usTransactionFactory.Create(amountOwed, amountReceived);
            Assert.That(transaction, Is.TypeOf<USTransaction>());
            Assert.AreEqual(amountOwed, transaction.Owed);
            Assert.AreEqual(amountReceived, transaction.Received);
            Assert.IsTrue(transaction.Change.IsEmpty());

        }
    }
}
