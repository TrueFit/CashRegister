using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class DollarTest
    {
        private Dollar dollar;

        [SetUp]
        public void Setup()
        {
            dollar = new Dollar();
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual("dollar", dollar.Name);
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(1.00, dollar.Value, 0.001);
        }

        [Test]
        public void MakeChange_InValueIsGreater()
        {
            int count = dollar.MakeChange(3.87);
            Assert.AreEqual(3, count);
        }

        [Test]
        public void MakeChange_InValueIsEqual()
        {
            int count = dollar.MakeChange(2.00);
            Assert.AreEqual(2, count);
        }

        [Test]
        public void MakeChange_InValueIsLess()
        {
            int count = dollar.MakeChange(0.79);
            Assert.AreEqual(0, count);
        }

        [Test]
        public void GetRemainder_CountIsHigh()
        {
            double remainder = dollar.GetRemainder(0.79, 1);
            Assert.AreEqual(-0.21, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsEqual()
        {
            double remainder = dollar.GetRemainder(2.00, 2);
            Assert.AreEqual(0.00, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsLow()
        {
            double remainder = dollar.GetRemainder(3.87, 3);
            Assert.AreEqual(0.87, remainder, 0.001);
        }
    }
}
