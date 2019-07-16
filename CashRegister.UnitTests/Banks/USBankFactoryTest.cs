using CashRegister.Core.Banks;
using NUnit.Framework;

namespace CashRegister.UnitTests.Banks
{
    public class USBankFactoryTest
    {
        private USBankFactory usBankFactory;

        [SetUp]
        public void Setup()
        {
            usBankFactory = new USBankFactory();
        }

        [Test]
        public void Create()
        {
            var bank = (USBank)usBankFactory.Create();
            Assert.That(bank, Is.TypeOf<USBank>());
        }
    }
}
