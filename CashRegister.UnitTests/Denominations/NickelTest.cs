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
            Assert.AreEqual(nickel.Name, "nickel");
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(nickel.Value, 0.05);
        }
    }
}
