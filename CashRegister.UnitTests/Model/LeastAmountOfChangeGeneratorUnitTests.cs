using System.Collections.Generic;
using CashRegister.Model;
using CashRegister.Model.Implementation;
using CashRegister.Model.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CashRegister.UnitTests.Model
{
    [TestClass]
    public class LeastAmountOfChangeGeneratorUnitTests
    {
        [TestMethod]
        public void Should_Generate_LeastAmount_Of_Change()
        {
            // Setup
            IChangeGenerator generator = ModelLocator.LeastAmountOfChangeGenerator;

            // Execute
            string output1 = generator.Generate(2.12, 3.00);
            string output2 = generator.Generate(1.97, 2.00);

            // Check
            Assert.AreEqual("3 quarters,1 dime,3 pennies", output1);
            Assert.AreEqual("3 pennies", output2);
        }
    }
}
