using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class QuarterTest
    {
        private Quarter quarter;

        [SetUp]
        public void Setup()
        { 
            quarter = new Quarter();
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual(quarter.Name, "quarter");
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(quarter.Value, 0.25);
        }
    }
}
