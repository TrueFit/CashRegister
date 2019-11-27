using Interfaces;
using System.Linq;

namespace Services
{
  public class MinimumChangeCalculator:IChangeCalculator
    {
        private ICalculator Calculator {get;set;}

        public MinimumChangeCalculator(ICalculator calculator)
        {
            Calculator = calculator;
        }

        public IChange Calculate(decimal amountDue, decimal amountPaid)
        {
            var result = Calculator.Calculate(amountDue, amountPaid);
            if (result == null || !result.Any()) return null;

            return result.OrderBy(r => r.TotalCoins).FirstOrDefault();
        }
    }
}
