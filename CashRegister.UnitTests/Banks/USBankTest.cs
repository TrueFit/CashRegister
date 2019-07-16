using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using NUnit.Framework;

namespace CashRegister.UnitTests.Banks
{
    public class USBankTest
    {
        private USBank usBank;

        [SetUp]
        public void Setup()
        {
            usBank = (USBank) USBank.Initialize();
        }

        [Test]
        public void Retrieve_Dollar()
        {
            var dollar = usBank.Retrieve(USValues.Dollar);
            Assert.AreEqual("dollar", dollar.Name);
            Assert.AreEqual(1.00, dollar.Value, 0.001);
        }

        [Test]
        public void Retrieve_Quarter()
        {
            var quarter = usBank.Retrieve(USValues.Quarter);
            Assert.AreEqual("quarter", quarter.Name);
            Assert.AreEqual(0.25, quarter.Value, 0.001);
        }

        [Test]
        public void Retrieve_Dime()
        {
            var dime = usBank.Retrieve(USValues.Dime);
            Assert.AreEqual("dime", dime.Name);
            Assert.AreEqual(0.1, dime.Value, 0.001);
        }

        [Test]
        public void Retrieve_Nickel()
        {
            var nickel = usBank.Retrieve(USValues.Nickel);
            Assert.AreEqual("nickel", nickel.Name);
            Assert.AreEqual(0.05, nickel.Value, 0.001);
        }

        [Test]
        public void Retrieve_Penny()
        {
            var penny = usBank.Retrieve(USValues.Penny);
            Assert.AreEqual("penny", penny.Name);
            Assert.AreEqual(0.01, penny.Value, 0.001);
        }
    }
}
