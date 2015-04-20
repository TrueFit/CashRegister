using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CashRegisterTests
{
    [TestClass]
    public class CashRegisterChangeIntegrationTests
    {
        private CashRegister.ChangeMaker change = new CashRegister.ChangeMaker();

        [TestInitialize]
        public void TestInitialize()
        {
            change.AddDefaultCurrencies();
        }

        [TestMethod]
        public void Total_1_Paid_2_Result_1()
        {
            string result = change.GetChange(1, 2);
            Assert.AreEqual("1 one", result);
        }

        [TestMethod]
        public void Total_10_Paid_30_Result_20()
        {
            string result = change.GetChange(10, 30);
            Assert.AreEqual("1 twenty", result);
        }

        [TestMethod]
        public void Total_20_Paid_30_Result_10()
        {
            string result = change.GetChange(20, 30);
            Assert.AreEqual("1 ten", result);
        }

        [TestMethod]
        public void Total_25Cents_Paid_50Cents_Result_Quarter()
        {
            string result = change.GetChange(0.25m, .50m);
            Assert.AreEqual("1 quarter", result);
        }

        [TestMethod]
        public void Total_16_Paid_30_Result_14()
        {
            string result = change.GetChange(16, 30);
            Assert.AreEqual("1 ten,4 ones", result);
        }

        [TestMethod]
        public void Acceptance_Test_One()
        {
            string result = change.GetChange(2.12m, 3.00m);
            Assert.AreEqual("3 quarters,1 dime,3 pennies", result);
        }

        [TestMethod]
        public void Acceptance_Test_Two()
        {
            string result = change.GetChange(1.97m, 2.00m);
            Assert.AreEqual("3 pennies", result);
        }

        [TestMethod]
        public void Acceptance_Test_Three_Verify_Random_Change_Is_Not_Optimized_Change()
        {
            string result = change.GetChange(3.33m, 5.00m);
            string result2 = change.GetChange(3.33m, 5.00m);
            Assert.AreNotEqual(result2, result);
            // there is some kind of mathematically miniscule chance that this will fail - run it again if it does
        }

        [TestMethod]
        public void Total_1_Paid_1_No_Change()
        {
            string result = change.GetChange(1.00m, 1.00m);
            Assert.AreEqual("No Change.", result);
        }

        [TestMethod]
        public void Total_2_Paid_1_Negative_Change()
        {
            string result = change.GetChange(2.00m, 1.00m);
            Assert.AreEqual("Total was more than amount paid.", result);
        }

        public void Add_50Cents_Piece_Total_50Cents_Paid_1_Result_50_Cent_Piece()
        {
            CashRegister.ChangeMaker changeAdd = new CashRegister.ChangeMaker();
            changeAdd.AddDefaultCurrencies();
            changeAdd.AddCurrency(new CashRegister.Currency("fifty cent piece", "fifty cent pieces", 0.50m));
            string result = change.GetChange(1.00m, 0.50m);
            Assert.AreEqual("1 fifty cent piece.", result);
        }
    }
}
