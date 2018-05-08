using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CashRegister.Tests
{
    [TestClass]
    public class CashRegisterTests
    {
        [TestMethod]
        public void ProcessChange_ShouldReturnLowestAmountOfChange_WhenProvidedCostAndPaidDecimals()
        {
            var cashRegister = new Core.CashRegister();
            const string input = "1.12,3.00";

            var result = cashRegister.ProcessChange(input);

            Assert.AreEqual("1 dollar,3 quarters,1 dime,3 pennies", result);
        }

        [TestMethod]
        public void ProcessChange_ShouldReturnRandomResult_WhenProvidedPriceDivisibleByThree()
        {
            var cashRegister = new Core.CashRegister();
            const string input = "3.33,5.00";

            var result = cashRegister.ProcessChange(input);

            Assert.AreNotEqual("1 dollar,2 quarters,1 dime,1 nickel,2 pennies", result);
        }
    }
}
