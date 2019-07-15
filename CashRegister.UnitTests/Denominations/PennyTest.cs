using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class PennyTest
    {
        private Penny penny;

        [SetUp]
        public void Setup()
        {
            penny = new Penny();
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual(penny.Name, "penny");
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(penny.Value, 0.01);
        }
    }
}
