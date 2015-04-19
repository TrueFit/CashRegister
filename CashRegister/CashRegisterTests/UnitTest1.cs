using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CashRegisterTests
{
    [TestClass]
    public class CashRegisterTests
    {
        private CashRegister.Change chng = new CashRegister.Change();

        [TestMethod]
        public void Total_1_Paid_2_Result_1()
        {
            string result = chng.GetChange(1, 2);
            Assert.AreEqual("1 one", result);
        }

        [TestMethod]
        public void Total_10_Paid_30_Result_20()
        {
            string result = chng.GetChange(10, 30);
            Assert.AreEqual("1 twenty", result);
        }

        [TestMethod]
        public void Total_20_Paid_30_Result_10()
        {
            string result = chng.GetChange(20, 30);
            Assert.AreEqual("1 ten", result);
        }

        [TestMethod]
        public void Total_25Cents_Paid_50Cents_Result_Quarter()
        {
            string result = chng.GetChange(0.25m, .50m);
            Assert.AreEqual("1 quarter", result);
        }

        [TestMethod]
        public void Total_16_Paid_30_Result_14()
        {
            string result = chng.GetChange(16, 30);
            Assert.AreEqual("1 ten,4 ones", result);
        }

        [TestMethod]
        public void Acceptance_Test_One()
        {
            string result = chng.GetChange(2.12m, 3.00m);
            Assert.AreEqual("3 quarters,1 dime,3 pennies", result);
        }

        [TestMethod]
        public void Acceptance_Test_Two()
        {
            string result = chng.GetChange(1.97m, 2.00m);
            Assert.AreEqual("3 pennies", result);
        }

        [TestMethod]
        public void Acceptance_Test_Three_Verify_Random_Change_Is_Not_Optimized_Change()
        {
            string result = chng.GetChange(3.33m, 5.00m);
            string result2 = chng.GetChange(3.33m, 5.00m);
            Assert.AreNotEqual(result2, result);
            // there is some kind of mathematically miniscule chance that this will fail - run it again if it does
        }
    }
}
