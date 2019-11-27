using Microsoft.VisualStudio.TestTools.UnitTesting;
using Interfaces;
using Services;
using DomainModels;
using System.Linq;

namespace UnitTests
{
    [TestClass]
    public class RandomChangeCalculatorTests
    {
        ICalculator Calc;
        IChangeCalculator RanCalc;

        [TestInitialize]
        public void Setup()
        {
            Calc =  new ChangeCalculator(new USDollar());
            RanCalc= new RandomChangeCalculator(Calc);
        }

        [TestMethod]
        public void TestMethod1()
        {
            var result = RanCalc.Calculate(3.15m, 3.50m);
            Assert.AreEqual(35, result.TotalValue);
        }

    }
}
