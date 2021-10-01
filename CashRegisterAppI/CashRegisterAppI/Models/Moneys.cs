using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CashRegisterAppI.Models
{
    public class Moneys
    {
        public int Dollars { get; set; }
        public int Quarters { get; set; }
        public int Dimes { get; set; }
        public int Nickles { get; set; }
        public int Pennies { get; set; }
        public decimal? ChangeDue { get; set; }
        private static Random Ran = new Random();

        public Moneys(decimal price)
        {
            ChangeDue = price;
            Dollars = (int)(price / 1);
            price %= 1;

            Quarters = (int)(price / .25m);
            price %= .25m;

            Dimes = (int)(price / .10m);
            price %= .10m;

            Nickles = (int)(price / .05m);
            price %= .05m;

            Pennies = (int)(price / .01m);
        }
        public Moneys(decimal price, bool random)
        {
            decimal[] arr = { 1, .25m, .10m, .05m, .01m };
            Ran = new Random();
            arr = arr.OrderBy(x => Ran.Next()).ToArray();
            ChangeDue = price;
            foreach (decimal i in arr)
            {
                if (i == 1)
                {
                    Dollars = (int)(price / 1);
                    price %= 1;
                }

                if (i == .25m)
                {
                    Quarters = (int)(price / .25m);
                    price %= .25m;
                }

                if (i == .10m)
                {
                    Dimes = (int)(price / .10m);
                    price %= .10m;
                }

                if (i == .05m)
                {
                    Nickles = (int)(price / .05m);
                    price %= .05m;
                }

                if (i == .01m)
                {
                    Pennies = (int)(price / .01m);
                }


            }

        }
    }
}
