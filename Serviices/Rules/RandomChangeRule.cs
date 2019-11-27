using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Interfaces;


namespace Services.Rules
{

   public class RandomChangeRule:IRule
    {
        int Divisor;
        int AmtDue;
        public IChangeCalculator ChangeCalculator { get; }
        public RandomChangeRule(int divisor, ICalculator calc, int amtdue)
        {
            Divisor = divisor;
            ChangeCalculator = new RandomChangeCalculator(calc);
            AmtDue = amtdue;
        }

        public bool IsRuleApplicable()
        {
            var div = Math.DivRem(AmtDue, Divisor, out int rem);
            return rem == 0;
        }
    }
}
