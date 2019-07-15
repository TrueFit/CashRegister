using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class DimeTest
    {
        private Dime dime;

        [SetUp]
        public void Setup()
        {
            dime = new Dime();
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual(dime.Name, "dime");
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(dime.Value, 0.1);
        }
    }
}
