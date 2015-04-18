using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CashRegisterTests
{
    [TestClass]
    public class CashRegistertests
    {
        [TestMethod]
        public void SimpleTest()
        {
            var chng = new CashRegister.Change();
            string result = chng.GetChange(1, 2);
            Assert.AreEqual("1 Dollar", result);
        }
    }
}
