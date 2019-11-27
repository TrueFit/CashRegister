using System.Collections.Generic;
using Interfaces;

namespace Services
{   public class RuleProcessor:IRuleProcessor
    {
        public IChangeCalculator ProcessRules(List<IRule> rules)
        {
            foreach (var rule in rules)
            {
                if (rule.IsRuleApplicable())
                    return rule.ChangeCalculator;
            }
            return null;
        }
    }
}
