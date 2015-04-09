using System.Text;

namespace Dollar.Web.Common
{
    public abstract class CalculatorBase : ICalculator
    {
        public abstract string Calculate(decimal amountOwed, decimal amountPaid);

        protected int Dollars { get; set; }

        protected int Quarters { get; set; }

        protected int Dimes { get; set; }

        protected int Nickels { get; set; }

        protected int Pennies { get; set; }

        protected string GenerateOutput()
        {
            var output = new StringBuilder();

            if (Dollars > 0)
            {
                output.Append(Dollars > 1
                    ? string.Format("{0} Dollars, ", Dollars)
                    : string.Format("{0} Dollar, ", Dollars));
            }

            if (Quarters > 0)
            {
                output.Append(Quarters > 1
                    ? string.Format("{0} Quarters, ", Quarters)
                    : string.Format("{0} Quarter, ", Quarters));
            }

            if (Dimes > 0)
            {
                output.Append(Dimes > 1
                    ? string.Format("{0} Dimes, ", Dimes)
                    : string.Format("{0} Dime, ", Dimes));
            }

            if (Nickels > 0)
            {
                output.Append(Nickels > 1
                    ? string.Format("{0} Nickels, ", Nickels)
                    : string.Format("{0} Nickel, ", Nickels));
            }

            if (Pennies > 0)
            {
                output.Append(Pennies > 1
                    ? string.Format("{0} Pennies, ", Pennies)
                    : string.Format("{0} Penny, ", Pennies));
            }

            return output.ToString().Trim().TrimEnd(',');
        }
    }
}