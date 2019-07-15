using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class DenominationTest
    {
        private Denomination denomination;

        [SetUp]
        public void Setup()
        {
            denomination = new Denomination("test", 0.33);
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual(denomination.Name, "test");
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(denomination.Value, 0.33);
        }
    }
}
