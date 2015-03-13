using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
    class Program
    {
        /*
         * Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. 
         * The function of the application is to tell the cashier how much change is owed, and what denominations should be used.
         * In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. 
         * If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))
         * Input and output files will be located in located in /bin/debug
        */
        static void Main(string[] args)
        {
            // Load the input file
            var reader = new StreamReader(File.OpenRead(@"input.csv")); 
            // Create The Output File
            StreamWriter asdf = new StreamWriter(@"results.txt"); 
            
            // Process the input file into two string arrays
            List<string> listAmtOwed = new List<string>();
            List<string> listAmtPaid = new List<string>();
            while (!reader.EndOfStream)
            {
                var line = reader.ReadLine();
                var values = line.Split(',');

                listAmtOwed.Add(values[0]);
                listAmtPaid.Add(values[1]);
            }
            reader.Close(); // Close Input file
            ProcessLines(asdf,listAmtOwed, listAmtPaid); // Process the two string arrays
            asdf.Close(); // Close the output file
        }

    static private void ProcessLines(StreamWriter sw, List<string> AmtOwed, List<string> AmtPaid)
    {
        StringBuilder sb = new StringBuilder();
        // Open The Output File
         for(int i = 0; i < AmtOwed.Count; i++)
        {
            // Validate the amount owed and paid
            decimal amountowed = 0;
            decimal amountpaid = 0;
            decimal amountchange = 0;

            decimal.TryParse(AmtOwed[i], out amountowed);
            decimal.TryParse(AmtPaid[i], out amountpaid);

            // Validate Transaction
            // If this were an interactive system error conditions fail and return

            if (amountowed <= 0)
            {
                sw.WriteLine("The amount owed must be greater than 0");
                continue;
            }
            if (amountowed > amountpaid)
            {
                sw.WriteLine("The amount paid cannot be less than the amount owed. Sorry No credit.");
                continue;
            }

            if (amountowed == amountpaid)
            {
                sw.WriteLine("Thank you for paying with exact change.");
                continue;
            }

            amountchange = amountpaid - amountowed;
            int dollars = (int)(amountchange);
            amountchange = amountchange - (decimal)dollars;
            int cents = (int)(amountchange * (decimal)100);
            sb = new StringBuilder();
            sb.Append("Amount owed = " + amountowed.ToString() + " ");
            sb.Append("Amount paid = " + amountpaid.ToString() + " ");
            sw.WriteLine(sb.ToString());
            CalculateChange(sw, dollars, cents); // Calculate and output the formatted change
            sw.WriteLine();
        }
    }
     
        static private void CalculateChange(StreamWriter sw, int dollars, int cents)
        {

            // See if the dollar amount of the change change is divisible by 3
            // populate randomNumber if so
            int modelo = dollars % 3;
            int randomNumber = -1;
            if (modelo == 0)
            {
                Random random = new Random();
                randomNumber = random.Next(0, 100);
            }

            int remainder = 0;
            int dollarcount = dollars;

            //  Counts will be calculated in calcDenominationCount
            int quarterCount = 0;
            int dimeCount = 0;
            int nickleCount = 0;
            int pennyCount = 0;



            remainder = cents;
            if (randomNumber == -1) // Do not vary calculation
            {
                calcDenominationCount(remainder, 25, ref quarterCount, ref remainder);
                calcDenominationCount(remainder, 10, ref dimeCount, ref remainder);
                calcDenominationCount(remainder, 5, ref nickleCount, ref remainder);
            }
            else
            {
                // Based on the random number generatet format the cants portion of the change 
                if ((randomNumber > 0) && (randomNumber <= 33))
                {
                    calcDenominationCount(remainder, 25, ref quarterCount, ref remainder);
                }
                if ((randomNumber > 33) && (randomNumber <= 66))
                {
                    calcDenominationCount(remainder, 10, ref dimeCount, ref remainder);
                }
                if ((randomNumber > 66) && (randomNumber < 100))
                {
                    calcDenominationCount(remainder, 5, ref nickleCount, ref remainder);
                }
            }
            calcDenominationCount(remainder, 1, ref pennyCount, ref remainder);

            // Build the output string
            StringBuilder sb = new StringBuilder("Your change is ");
            formatchange(dollarcount, "dollar", sb);
            formatchange(quarterCount, "quarter", sb);
            formatchange(dimeCount, "dime", sb);
            formatchange(nickleCount, "nickel", sb);
            formatchange(pennyCount, "penny", sb);

            sw.WriteLine(sb.ToString());
        }

        static void calcDenominationCount(int amt, int divisor,ref int count, ref int remainder)
        {
            count = amt / divisor; // Determine the number of times the divisor fits into the amount
            remainder = amt - (divisor * count); //subtracte the value from the amount
            remainder = remainder % divisor; // set the modelo based on the divisor
        }
        /// <summary>
        /// Format and append to the stringbuilder parameter the proper denomination count and name (singular or plural)
        /// </summary>
        /// <param name="denominationCount"></param>
        /// <param name="denomination"></param>
        /// <param name="sb"></param>
        static void formatchange(int denominationCount, string denomination, StringBuilder sb)
        {
            // if the count of the denomination is 0 ignore it for formatting
            if (denominationCount == 0)
            {
                return; 
            }
            if (denominationCount > 1 )
            {
                if (denomination.ToUpper() == "PENNY")
                {
                    denomination = "pennies";
                }
                else
                {
                    denomination = denomination + "s";
                }
            }
            sb.Append(denominationCount.ToString() + " " + denomination + " ");
            return;
        }
    }
}
