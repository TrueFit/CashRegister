using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    class Program
    {
        public const int QUARTER = 25;
        public const int DIME = 10;
        public const int NICKEL = 5;
        public const int PENNIE = 1;

        static void Main(string[] args)
        {
            int quarters, dimes, nickels, pennies;
            int[] coinsValue = new int[] { QUARTER, DIME, NICKEL, PENNIE };
            
            //Read data from the input file
            string[] lines = File.ReadAllLines("inputText.txt");
            foreach (string line in lines)
            {
                string[] col = line.Split(',');
                double amountToPay = Convert.ToDouble(col[1]) - Convert.ToDouble(col[0]);
                string s = amountToPay.ToString();
                string[] parts = s.Split('.');
                int dollars = int.Parse(parts[0]);
                int change = int.Parse(parts[1]);

                quarters = dimes = nickels = pennies = 0;
                double toCompare = Convert.ToDouble(col[0]);
               
                //Checking if the owed amount is divisible by 3
                //Lowest coins will be generated under if condition
                if ((Math.Truncate(toCompare)) % 3 != 0)
                {
                    quarters = change / 25;
                    change %= 25;
                    dimes = change / 10;
                    change %= 10;
                    nickels = change / 5;
                    pennies = change % 5;
                }
                //Random number of coins
                else
                {                    
                    Random random = new Random();
                    while (change > 0)
                    {
                        int rand = random.Next(0, 4);
                        int selectedValue = coinsValue[rand];

                        switch (selectedValue)
                        {
                            case 25:
                                if (change > 24)
                                {
                                    change -= 25;
                                    quarters++;
                                }
                                break;
                            case 10:
                                if (change > 9)
                                {
                                    change -= 10;
                                    dimes++;
                                }
                                break;
                            case 5:
                                if (change > 4)
                                {
                                    change -= 5;
                                    nickels++;
                                }
                                break;
                            case 1:
                                change -= 1;
                                pennies++;
                                break;
                        }
                    }
                }
                String toWrite = String.Format("{0} Dollars, {1} Quaters, {2} Dimes, {3} Nickels, {4} Pennies", dollars, quarters, dimes, nickels, pennies);
                
                //Write new line in the output file for every new input file
                using (StreamWriter file =
                new StreamWriter(@"outputText.txt", true))
                {
                    file.WriteLine(toWrite);
                }
            }           
        }
    }
}
