using Microsoft.VisualStudio.TestTools.UnitTesting;
using Interfaces;
using Services;
using DomainModels;
using System.Linq;
using DomainModels.Denominations;

namespace UnitTests
{
    [TestClass]
    public class ChangeCalculatorTests
    {
        ICalculator Calc;

        [TestInitialize]
        public void Setup()
        {
            Calc = new ChangeCalculator(new USDollar());
        }

        [TestMethod]
        public void Calculate_should_return_valid_totals ()
        {
           var result = Calc.Calculate(3.15m, 3.50m);
            Assert.IsFalse(result.Any(r=>r.TotalValue!=35));
        }

        [TestMethod]
        public void Calculate_should_return_3_pennies()
        {
            var result = Calc.Calculate(1.97m, 2.00m);
            Assert.AreEqual(1,result.Count);
            Assert.AreEqual(3, result[0].TotalCoins);
            Assert.AreEqual(3, result[0].TotalValue);
            Assert.IsInstanceOfType(result[0].ChangeList[0].Money, typeof(Penny));
        }

       
        [TestMethod]
        public void Calculate_should_return_13_variations()//getting some duplicates, need to see if Calculator can be tightened up more
        {
            var result = Calc.Calculate(.56m, .75m);
            Assert.AreEqual(13, result.Count);
           
        }
    }
}
