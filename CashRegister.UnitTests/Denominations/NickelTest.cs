using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class NickelTest
    {
        private Nickel nickel;

        [SetUp]
        public void Setup()
        {
            nickel = new Nickel();
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual("nickel", nickel.Name);
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(0.05, nickel.Value, 0.001);
        }

        [Test]
        public void MakeChange_InValueIsGreater()
        {
            int count = nickel.MakeChange(0.38);
            Assert.AreEqual(7, count);
        }

        [Test]
        public void MakeChange_InValueIsEqual()
        {
            int count = nickel.MakeChange(0.15);
            Assert.AreEqual(3, count);
        }

        [Test]
        public void MakeChange_InValueIsLess()
        {
            int count = nickel.MakeChange(0.03);
            Assert.AreEqual(0, count);
        }

        [Test]
        public void GetRemainder_CountIsHigh()
        {
            double remainder = nickel.GetRemainder(0.03, 1);
            Assert.AreEqual(-0.02, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsEqual()
        {
            double remainder = nickel.GetRemainder(0.15, 3);
            Assert.AreEqual(0.00, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsLow()
        {
            double remainder = nickel.GetRemainder(0.38, 7);
            Assert.AreEqual(0.03, remainder, 0.001);
        }
    }
}
