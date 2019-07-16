using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using NUnit.Framework;

namespace CashRegister.UnitTests.Tills
{
    public class TillTest
    {
        private Till till;

        [SetUp]
        public void Setup()
        {
            var bank = Bank.InitializeFactories();
            till = Till.InitializeFactories(bank);
        }

        [TestCase(true)]
        [TestCase(false)]
        public void ExecuteCreation_USLayout(bool randomize)
        {
            var usTill = till.ExecuteCreation(Layouts.US, randomize);
            Assert.That(usTill, Is.TypeOf<USTill>());
        }
    }
}
