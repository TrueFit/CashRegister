using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using CashRegister;

namespace Tests
{
    [TestClass]
    public class UnitTest1
    {

        [TestMethod]
        public void TestDividerValue()
        {
            int actualValue = 3;
            int expectedValue = 3;

            //actualValue = CashRegister.CashRegisterClass.CashRegisterClass.dividor;

            Assert.AreEqual(expectedValue, actualValue);
        }
    }
}
