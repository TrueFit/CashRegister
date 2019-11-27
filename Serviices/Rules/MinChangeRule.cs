using System;
using Interfaces;

namespace Services.Rules
{
   public class MinChangeRule:IRule
    {       
        public IChangeCalculator ChangeCalculator { get; }
        public MinChangeRule( ICalculator calc)
        {
           ChangeCalculator = new MinimumChangeCalculator(calc);
        }

        public bool IsRuleApplicable()
        {
            return true;
        }
    }
}
