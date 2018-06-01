using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calculator
{
    public class Calculator
    {
        public int RandomDivisor { get; set; }
        public int SpecialRule { get; set; }
        public string Locale { get; set; }
        public double AmountDue { get; set; }
        public double AmountTendered { get; set; }
        public int Dollars { get; set; }
        public int Quarters { get; set; }
        public int Dimes { get; set; }
        public int Nickels { get; set; }
        public int Pennies { get; set; }

        public Calculator()
        {
            RandomDivisor = 3;
            SpecialRule = 0;
            Locale = "US";
        }

        public void CalculateChange()
        {
            if (SpecialRule == 0 && AmountDue / RandomDivisor >= 1)
            {
                CalculateRandomChange();
            }
            else if (SpecialRule > 0)
            {
                if (AmountDue / SpecialRule >= 1)
                {
                    CalculateRandomChange();
                }
                else
                {
                    CalculateSimpleChange();
                }
            }
            else
            {
                CalculateSimpleChange();
            }
        }

        private void CalculateRandomChange()
        {
            double dRemainder = 0;
            Random oRandom = new Random();
            double dChangeDue = Math.Abs(AmountDue - AmountTendered);

            double dRandomChange = (double)oRandom.Next((int)dChangeDue * 100) / 100;
            dRemainder = dChangeDue - dRandomChange;

            Dollars = (int)(dRemainder / 1) * 1;
            Quarters = (int)((dRemainder % 1) / .25);
            Dimes = (int)(((dRemainder % 1) % .25) / .10);
            Nickels = (int)((((dRemainder % 1) % .25) % .10) / .05);
            Pennies = (int)Math.Round((dRandomChange * 100) + (((((dRemainder % 1) % .25) % .10) % .05) / .01));
        }

        private void CalculateSimpleChange()
        {
            double dChangeDue = Math.Abs(AmountDue - AmountTendered);

            Dollars = (int)(dChangeDue / 1);
            Quarters = (int)((dChangeDue % 1) / .25);
            Dimes = (int)(((dChangeDue % 1) % .25) / .10);
            Nickels = (int)((((dChangeDue % 1) % .25) % .10) / .05);
            Pennies = (int)Math.Round((((((dChangeDue % 1) % .25) % .10) % .05) / .01));
        }
    }
}
