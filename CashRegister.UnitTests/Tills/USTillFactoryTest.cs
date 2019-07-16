using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using NUnit.Framework;

namespace CashRegister.UnitTests.Tills
{
    public class USTillFactoryTest
    {
        private USTillFactory usTillFactory;

        [SetUp]
        public void Setup()
        {
            var bankFactory = Bank.InitializeFactories();
            usTillFactory = new USTillFactory((USBank)bankFactory.ExecuteCreation(Layouts.US));
        }

        [TestCase(true)]
        [TestCase(false)]
        public void Create(bool randomize)
        {
            var till = usTillFactory.Create(randomize);
            Assert.That(till, Is.TypeOf<USTill>());
        }
    }
}
