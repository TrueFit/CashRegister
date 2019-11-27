using Microsoft.VisualStudio.TestTools.UnitTesting;
using Interfaces;
using Services;
using DomainModels;
using System.Linq;

namespace UnitTests
{
    [TestClass]
    public class MinimumChangeCalculatorTests
    {
        ICalculator Calc;
        IChangeCalculator MinCalc;

        [TestInitialize]
        public void Setup()
        {
            Calc = new ChangeCalculator(new USDollar());
            MinCalc = new MinimumChangeCalculator(Calc);
        }

        [TestMethod]
        public void Calculate_should_return_5()
        {
            var result = MinCalc.Calculate(3.15m, 3.50m);
            Assert.AreEqual(2 ,result.TotalCoins);
        }

    }
}
