using System.Collections.Generic;

namespace Interfaces
{
   public interface IRuleProcessor
    {
        /// <summary>
        /// Process a list of rules, returning the first that is applicaple
        /// Uses order of rules passed in
        /// </summary>
        /// <param name="rules"></param>
        /// <returns></returns>
        IChangeCalculator ProcessRules(List<IRule> rules);
    }
}
