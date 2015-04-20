using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using CashRegister.WebApi.Helpers;

namespace CashRegister.WebApi.UT
{
    [TestClass]
    public class DollarsToChangeConverterTest
    {
        [TestMethod]
        public void Convert()
        {
            var test1Output = DollarsToChangeConverter.Convert(354238980.12, 400000000.00);
            var test2Output = DollarsToChangeConverter.Convert(2.12, 3);
            var test3Output = DollarsToChangeConverter.Convert(1.97, 2);
            var test4Output = DollarsToChangeConverter.Convert(3.33, 5);

            var correctTest1Output = "9152 Five Thousand Dollar Bills,1 Thousand Dollar Bill,1 Fifty Dollar Bill,1 Ten Dollar Bill,4 One Dollar Bills,3 Quarters,1 Dime,2 Pennies";
            var correctTest2Output = "3 Quarters,1 Dime,2 Pennies";
            var correctTest3Output = "3 Pennies";
            var correctTest4Output = "1 One Dollar Bill,2 Quarters,1 Dime,1 Nickle,1 Penny";

            Assert.AreEqual(test1Output, correctTest1Output);
            Assert.AreEqual(test2Output, correctTest2Output);
            Assert.AreEqual(test3Output, correctTest3Output);
            Assert.AreEqual(test4Output, correctTest4Output);
        }
    }
}