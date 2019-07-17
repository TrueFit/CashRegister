using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using NUnit.Framework;

namespace CashRegister.UnitTests.Transactions
{
    public class USTransactionTest
    {
        private Transaction transactionFactory;

        [SetUp]
        public void Setup()
        {
            var bankFactory = Bank.InitializeFactories();
            var tillFactory = Till.InitializeFactories(bankFactory);
            transactionFactory = Transaction.InitializeFactories(tillFactory);
        }

        [TestCase(1.28, 2.00)]
        [TestCase(7.34, 10.00)]
        [TestCase(94.61, 100.00)]
        [TestCase(3.33, 5.00)]
        [TestCase(1.62, 2.00)]
        [TestCase(2.00, 1.28)]
        public void Owed(double amountOwed, double amountReceived)
        {
            var transaction = transactionFactory.ExecuteCreation(Layouts.US, amountOwed, amountReceived);
            Assert.AreEqual(amountOwed, transaction.Owed);
        }

        [TestCase(1.28, 2.00)]
        [TestCase(7.34, 10.00)]
        [TestCase(94.61, 100.00)]
        [TestCase(5.00, 5.00)]
        [TestCase(3.33, 5.00)]
        [TestCase(1.62, 2.00)]
        [TestCase(2.00, 1.28)]
        public void Received(double amountOwed, double amountReceived)
        {
            var transaction = transactionFactory.ExecuteCreation(Layouts.US, amountOwed, amountReceived);
            Assert.AreEqual(amountReceived, transaction.Received);
        }

        [TestCase(1.28, 2.00)]
        [TestCase(7.34, 10.00)]
        [TestCase(94.61, 100.00)]
        [TestCase(5.00, 5.00)]
        [TestCase(3.33, 5.00)]
        [TestCase(1.62, 2.00)]
        [TestCase(2.00, 1.28)]
        public void Change(double amountOwed, double amountReceived)
        {
            var transaction = transactionFactory.ExecuteCreation(Layouts.US, amountOwed, amountReceived);
            Assert.IsTrue(transaction.Change.IsEmpty());
        }

        [TestCase(1.28, 2.00)]
        [TestCase(7.34, 10.00)]
        [TestCase(94.61, 100.00)]
        [TestCase(5.00, 5.00)]
        [TestCase(3.33, 5.00)]
        [TestCase(1.62, 2.00)]
        [TestCase(2.00, 1.28)]
        public void Calculate(double amountOwed, double amountReceived)
        {
            var transaction = transactionFactory.ExecuteCreation(Layouts.US, amountOwed, amountReceived);
            transaction.Calculate();

            double total = 0.0;
            foreach (var kvp in transaction.Change.Amounts)
            {
                total += transaction.Change.Amounts[kvp.Key] * kvp.Key.Value;
            }

            double changeExpected = amountReceived - amountOwed;
            if (changeExpected < 0.0)
            {
                changeExpected = 0.0;
            }

            Assert.AreEqual(changeExpected, total, 0.001);
        }

        [Test]
        public void ToString_PreCalculated()
        {
            double amountOwed = 0.59;
            double amountRecieved = 2.00;

            var transaction = transactionFactory.ExecuteCreation(Layouts.US, amountOwed, amountRecieved);
            transaction.Calculate();

            var changeString = transaction.ToString();
            Assert.AreEqual("1 dollar, 1 quarter, 1 dime, 1 nickel, 1 penny", changeString);
        }

        [Test]
        public void ToString_AutoCalculated()
        {
            double amountOwed = 0.59;
            double amountRecieved = 2.00;

            var transaction = transactionFactory.ExecuteCreation(Layouts.US, amountOwed, amountRecieved);

            var changeString = transaction.ToString();
            Assert.AreEqual("1 dollar, 1 quarter, 1 dime, 1 nickel, 1 penny", changeString);
        }
    }
}
