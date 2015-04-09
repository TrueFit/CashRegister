using System;
using Dollar.Web.Common;

namespace Dollar.Web.Calculators
{
    public class ChangeCalculator : CalculatorBase
    {
        public override string Calculate(decimal amountOwed, decimal amountPaid)
        {
            Dollars = (int) amountPaid - (int) Math.Ceiling(amountOwed);

            var changeDue = (int)((amountPaid - amountOwed - Dollars) * 100);

            if (changeDue > (int) EChange.Quarter)
            {
                Quarters = changeDue/(int) EChange.Quarter;

                changeDue = changeDue%(int) EChange.Quarter;
            }

            if (changeDue > (int) EChange.Dime)
            {
                Dimes = changeDue/(int) EChange.Dime;

                changeDue = changeDue%(int) EChange.Dime;
            }

            if (changeDue > (int) EChange.Nickel)
            {
                Nickels = changeDue/(int) EChange.Nickel;

                changeDue = changeDue%(int) EChange.Nickel;
            }

            if (changeDue > 0)
            {
                Pennies = changeDue;
            }

            return GenerateOutput();
        }
    }
}