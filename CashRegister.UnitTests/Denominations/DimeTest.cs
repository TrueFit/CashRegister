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
            Assert.AreEqual("dime", dime.Name);
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(0.1, dime.Value, 0.001);
        }

        [Test]
        public void MakeChange_InValueIsGreater()
        {
            int count = dime.MakeChange(1.12);
            Assert.AreEqual(11, count);
        }

        [Test]
        public void MakeChange_InValueIsEqual()
        {
            int count = dime.MakeChange(0.50);
            Assert.AreEqual(5, count);
        }

        [Test]
        public void MakeChange_InValueIsLess()
        {
            int count = dime.MakeChange(0.05);
            Assert.AreEqual(0, count);
        }

        [Test]
        public void GetRemainder_CountIsHigh()
        {
            double remainder = dime.GetRemainder(0.05, 1);
            Assert.AreEqual(-0.05, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsEqual()
        {
            double remainder = dime.GetRemainder(0.5, 5);
            Assert.AreEqual(0.00, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsLow()
        {
            double remainder = dime.GetRemainder(1.12, 11);
            Assert.AreEqual(0.02, remainder, 0.001);
        }
    }
}
