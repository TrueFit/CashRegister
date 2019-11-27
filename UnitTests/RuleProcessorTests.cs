using Microsoft.VisualStudio.TestTools.UnitTesting;
using Interfaces;
using Services;
using DomainModels;
using Services.Rules;
using System.Collections.Generic;

namespace UnitTests
{
    [TestClass]
    public class RuleProcessorTests
    {
        ICalculator Calc;
        IRuleProcessor Proc;
        [TestInitialize]
        public void setup()
        {
            Calc = new ChangeCalculator(new USDollar());
            Proc = new RuleProcessor();
        }

        [TestMethod]
        public void ProcessRules_should_return_random()
        {
                
            var changeRules = new List<IRule> { new RandomChangeRule(3, Calc, 213), new MinChangeRule(Calc) };
            var result = Proc.ProcessRules(changeRules);

            Assert.IsInstanceOfType(result,typeof(RandomChangeCalculator));
        }

        [TestMethod]
        public void ProcessRules_should_return_min()
        {

            var changeRules = new List<IRule> { new RandomChangeRule(3, Calc, 212), new MinChangeRule(Calc) };
            var result = Proc.ProcessRules(changeRules);

            Assert.IsInstanceOfType(result, typeof(MinimumChangeCalculator));
        }


    }
}
