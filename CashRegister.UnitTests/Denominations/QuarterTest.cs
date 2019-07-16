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
            Assert.AreEqual("quarter", quarter.Name);
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(0.25, quarter.Value, 0.001);
        }

        [Test]
        public void MakeChange_InValueIsGreater()
        {
            int count = quarter.MakeChange(2.43);
            Assert.AreEqual(9, count);
        }

        [Test]
        public void MakeChange_InValueIsEqual()
        {
            int count = quarter.MakeChange(2.00);
            Assert.AreEqual(8, count);
        }

        [Test]
        public void MakeChange_InValueIsLess()
        {
            int count = quarter.MakeChange(0.24);
            Assert.AreEqual(0, count);
        }

        [Test]
        public void GetRemainder_CountIsHigh()
        {
            double remainder = quarter.GetRemainder(0.24, 1);
            Assert.AreEqual(-0.01, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsEqual()
        {
            double remainder = quarter.GetRemainder(2.00, 8);
            Assert.AreEqual(0.00, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsLow()
        {
            double remainder = quarter.GetRemainder(2.43, 9);
            Assert.AreEqual(0.18, remainder, 0.001);
        }
    }
}
