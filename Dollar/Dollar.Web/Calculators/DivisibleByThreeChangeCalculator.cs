using System;
using System.Linq;
using System.Threading;
using Dollar.Web.Common;

namespace Dollar.Web.Calculators
{
    public class DivisibleByThreeChangeCalculator : CalculatorBase
    {
        public override string Calculate(decimal amountOwed, decimal amountPaid)
        {
            var dollars = (int) amountPaid - (int) Math.Ceiling(amountOwed);

            var changeDue = (int) ((amountPaid - amountOwed - Dollars)*100);

            var totalChangeOwed = (dollars*100) + changeDue;

            var currencyRandom = new Random();

            var enumValues = Enum.GetValues(typeof(EChange)).Cast<EChange>().ToList();

            while (totalChangeOwed > 0)
            {
                var random = currencyRandom.Next(1, enumValues.Count) - 1;

                var change = enumValues.ElementAt(random);

                if (totalChangeOwed >= (int) change)
                {
                    totalChangeOwed -= (int) change;

                    switch (change)
                    {
                        case EChange.Dollar:
                            Dollars++;
                            break;
                        case EChange.Quarter:
                            Quarters++;
                            break;
                        case EChange.Dime:
                            Dimes++;
                            break;
                        case EChange.Nickel:
                            Nickels++;
                            break;
                        case EChange.Penny:
                            Pennies++;
                            break;
                    }
                }
                else
                {
                    enumValues.Remove(enumValues.ElementAt(random));
                }

                Thread.Sleep(10);
            }

            return GenerateOutput();
        }
    }
}