using System;
using System.Linq;
using Interfaces;

namespace Services
{
    public class RandomChangeCalculator : IChangeCalculator
    { 
        private ICalculator Calculator {get;set;}

        public RandomChangeCalculator(ICalculator calculator) {
            Calculator = calculator;
        }

        public IChange Calculate(decimal amountDue, decimal amountPaid)
        {
            var result = Calculator.Calculate( amountDue,  amountPaid);
            if (result == null || !result.Any()) return null;
            var ran = new Random().Next(0, result.Count);

            return result[ran];
        }

    }
}
