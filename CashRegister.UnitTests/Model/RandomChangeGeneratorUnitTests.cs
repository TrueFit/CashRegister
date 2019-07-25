using CashRegister.Model;
using CashRegister.Model.Implementation;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;

namespace CashRegister.UnitTests.Model
{
    [TestClass]
    public class RandomChangeGeneratorUnitTests
    {
        [TestMethod]
        public void Should_Return_Random_Outputs()
        {
            const double DOLLAR = 1.0;
            const double QUARTER = 0.25;
            const double DIME = 0.10;
            const double NICKEL = 0.05;
            const double PENNY = 0.01;

            const int TOTAL_COMBINATIONS = 213;
            const int SAMPLE_SIZE = 1000;

            // Setup
            var amount = new Dictionary<double, int>
            {
                {DOLLAR, 0},
                {QUARTER, 0},
                {DIME, 0},
                {NICKEL, 0},
                {PENNY, 0}
            };
            var names = new Dictionary<double, string>
            {
                {DOLLAR, "dollar"},
                {QUARTER, "quarter"},
                {DIME, "dime"},
                {NICKEL, "nickel"},
                {PENNY, "penny"}
            };

            var plurals = new Dictionary<string, string>
            {
                {"dollar", "dollars"},
                {"quarter", "quarters"},
                {"dime", "dimes"},
                {"nickel", "nickels"},
                { "penny", "pennies"}
            };

            var generator = new RandomChangeGenerator(amount, names, plurals);
            var results = new Dictionary<string, int>();

            // Execute
            for (int i = 0; i < SAMPLE_SIZE; i++)
            {
                string sampleOutput = generator.Generate(0.01, 1.00);

                if (!results.ContainsKey(sampleOutput))
                    results.Add(sampleOutput, 1);
                else
                    results[sampleOutput]++;
            }

            // Check
            Assert.AreNotEqual(1, results.Count);
            Assert.AreNotEqual(TOTAL_COMBINATIONS, results.Count + 1);
        }
    }
}
