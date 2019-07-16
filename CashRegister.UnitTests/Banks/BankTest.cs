using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using NUnit.Framework;

namespace CashRegister.UnitTests.Banks
{
    public class BankTest
    {
        private Bank bank;

        [SetUp]
        public void Setup()
        {
            bank = Bank.InitializeFactories();
        }

        [Test]
        public void ExecuteCreation_USLayout()
        {
            var usBank = bank.ExecuteCreation(Layouts.US);
            Assert.That(usBank, Is.TypeOf<USBank>());
        }
    }
}
