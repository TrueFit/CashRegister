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
            Assert.AreEqual(denomination.Value, 0.33, 0.001);
        }

        [Test]
        public void MakeChange_InValueIsGreater()
        {
            int count = denomination.MakeChange(5.00);
            Assert.AreEqual(count, 15);
        }

        [Test]
        public void MakeChange_InValueIsEqual()
        {
            int count = denomination.MakeChange(1.98);
            Assert.AreEqual(count, 6);
        }

        [Test]
        public void MakeChange_InValueIsLess()
        {
            int count = denomination.MakeChange(0.24);
            Assert.AreEqual(count, 0);
        }

        [Test]
        public void GetRemainder_CountIsHigh()
        {
            double remainder = denomination.GetRemainder(0.24, 1);
            Assert.AreEqual(remainder, -0.09, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsEqual()
        {
            double remainder = denomination.GetRemainder(1.98, 6);
            Assert.AreEqual(remainder, 0.00, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsLow()
        {
            double remainder = denomination.GetRemainder(5.00, 15);
            Assert.AreEqual(remainder, 0.05, 0.001);
        }
    }
}
