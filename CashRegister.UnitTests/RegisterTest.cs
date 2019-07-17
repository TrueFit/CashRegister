using CashRegister.Core;
using NUnit.Framework;

namespace CashRegister.UnitTests
{
    public class RegisterTest
    {
        private Register register;

        [SetUp]
        public void Setup()
        {
            register = new Register();
        }

        [TestCase("\n", 0)]
        [TestCase("5.00,5.00", 1)]
        [TestCase("1.28,2.00", 1)]
        [TestCase("7.34,10.00\n94.61,100.00", 2)]
        public void LoadFromString(string ledger, int count)
        {
            register.LoadFromString(ledger);
            Assert.AreEqual(count, register.NumberOfTransactions());
        }

        [TestCase("\n", "")]
        [TestCase("5.00,5.00", "No change due\n")]
        [TestCase("1.28,2.00", "2 quarters, 2 dimes, 2 pennies\n")]
        [TestCase("7.34,10.00\n94.61,100.00", "2 dollars, 2 quarters, 1 dime, 1 nickel, 1 penny\n5 dollars, 1 quarter, 1 dime, 4 pennies\n")]
        public void Calculate(string ledger, string changeString)
        {
            register.LoadFromString(ledger);
            register.Calculate();
            var resultString = register.ToString();

            Assert.AreEqual(changeString, resultString);
        }

        [TestCase("5.00,5.00", "")]
        [TestCase("1.28,2.00", "2 quarters, 2 dimes, 2 pennies")]
        [TestCase("7.34,10.00\n94.61,100.00", "2 dollars, 2 quarters, 1 dime, 1 nickel, 1 penny")]
        public void GetTransaction(string ledger, string changeString)
        {
            register.LoadFromString(ledger);
            register.Calculate();
            var transaction = register.GetTransaction(0);
            var transactionString = transaction.ToString();

            Assert.AreEqual(changeString, transactionString);
        }

        [Test]
        public void Clear()
        {
            string ledgerString = "7.34,10.00\n94.61,100.00";

            register.LoadFromString(ledgerString);

            Assert.AreEqual(2, register.NumberOfTransactions());

            register.Clear();

            Assert.AreEqual(0, register.NumberOfTransactions());
        }
    }
}
