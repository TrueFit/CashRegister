using System.Collections.Generic;
using CashRegister.Model.Implementation;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CashRegister.UnitTests.Model
{
    [TestClass]
    public class ChangeGeneratorUnitTests
    {
        [TestMethod]
        public void Should_Build_OutputString_Correctly()
        {
            // Setup
            const double PENNY = 0.01;
            const double DOLLAR = 1.0;
            const double QUARTER = 0.25;

            var amountOfEachUnitOfCurrency = new Dictionary<double, int>
            {
                {PENNY, 1},
                {DOLLAR, 3},
                {QUARTER, 6}
            };

            var currencyValueNameMapping = new Dictionary<double, string>
            {
                {PENNY, "Penny" },
                {DOLLAR, "Dollar" },
                {QUARTER, "Quarter" }
            };

            var pluralMapping = new Dictionary<string, string>
            {
                {"Penny", "Pennies" },
                {"Dollar", "Dollars" },
                {"Quarter", "Quarters" }
            };

            var mockedGenerator = new MockGenerator(amountOfEachUnitOfCurrency, currencyValueNameMapping, pluralMapping);

            // Execute
            string output = mockedGenerator.Generate(0.0, 0.0);

            // Check
            Assert.AreEqual(@"3 Dollars,6 Quarters,1 Penny", output);
        }

        private class MockGenerator : ChangeGenerator
        {
            public MockGenerator(IDictionary<double, int> amountOfEachUnitOfCurrency, IDictionary<double, string> currencyValueNameMapping, IDictionary<string, string> pluralCurrencyUnitNames) : base(amountOfEachUnitOfCurrency, currencyValueNameMapping, pluralCurrencyUnitNames)
            {
            }

            public override string Generate(double amountOwed, double amountPaid)
            {
                return CreateOutputString();
            }
        }
    }
}
