using System;
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

        [TestMethod]
        public void ProcessChange_ShouldThrowArgumentException_WhenProvidedHigherAmountOwedThanAmountPaid()
        {
            var cashRegister = new Core.CashRegister();
            const string input = "3.27,1.25";

            Assert.ThrowsException<ArgumentException>(() => cashRegister.ProcessChange(input));
        }

        [TestMethod]
        public void ProcessChange_ShouldThrowArgumentException_WhenProvidedInvalidInputString()
        {
            var cashRegister = new Core.CashRegister();
            const string input = "3.27,";
            
            Assert.ThrowsException<ArgumentException>(() => cashRegister.ProcessChange(input));
        }

        [TestMethod]
        public void ProcessChange_ShouldThrowArgumentException_WhenProvidedEmptyString()
        {
            var cashRegister = new Core.CashRegister();

            Assert.ThrowsException<ArgumentException>(() => cashRegister.ProcessChange(string.Empty));
        }

        [TestMethod]
        public void ProcessChange_ShouldThrowArgumentException_WhenProvidedNull()
        {
            var cashRegister = new Core.CashRegister();

            Assert.ThrowsException<ArgumentException>(() => cashRegister.ProcessChange(null));
        }

        [TestMethod]
        public void CalculateLowestAmountOfChange_ShouldReturnLowestAmountOfChange_WhenProvidedDecimalValue()
        {
            const decimal input = 1.91m;

            var result = Core.CashRegister.CalculateLowestAmountOfChange(input);

            Assert.AreEqual("1 dollar,3 quarters,1 dime,1 nickle,1 penny", result);
        }

        [TestMethod]
        public void CalculateRandomChange_ShouldReturnRandomAmountOfChange_WhenProvidedDecimalValue()
        {
            const decimal input = 1.91m;

            var result = Core.CashRegister.CalculateRandomChange(input);

            Assert.AreNotEqual("1 dollar,3 quarters,1 dime,1 nickle,1 penny", result);
        }
    }
}
