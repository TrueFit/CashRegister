using System;
using System.Collections.Generic;

namespace CashRegister
{

    class CashRegister
    {
        const decimal DOLLAR_VAL = 1;
        const decimal QUARTER_VAL = 0.25m;
        const decimal DIMES_VAL = 0.1m;
        const decimal NICKELS_VAL = 0.05m;
        const decimal PENNIES_VAL = 0.01m;
        const string INPUT_LOC = @"C:\Data\Input\transactions.txt";
        const string OUTPUT_LOC = @"C:\Data\Output\transactionChange.txt";

        private struct Transaction
        {
            public decimal price;
            public decimal paid;
        }

        private static void Main(string[] args)
        {
            Console.WriteLine("Hello! Press R to read and parse file, press E to exit.");

            bool exit = false;
            List<Transaction> transactions;

            while (!exit) {
                transactions = new List<Transaction>();
                string input = Console.ReadLine();

                if (input == "r")
                {
                    string[] inputFile = System.IO.File.ReadAllLines(INPUT_LOC);
                    foreach(string inputLine in inputFile){
                        string[] split = inputLine.Split(",");

                        if (split.Length == 2) // check if valid input length
                        {
                            Transaction t = new Transaction();
                            if (decimal.TryParse(split[0], out t.price) && decimal.TryParse(split[1], out t.paid)) // make sure we're 
                            {
                                transactions.Add(t);
                            }
                        }
                    }

                    List<string> change = CalculateChange(transactions);

                    System.IO.File.WriteAllLines(OUTPUT_LOC, change);
                }
                else if (input == "e")
                    exit = true;
            }
        }       

        private static List<string> CalculateChange(List<Transaction> transactions)
        {
            List<string> changeList = new List<string>();

            int pennies = 0;
            int nickles = 0;
            int dimes = 0;
            int quarters = 0;
            int dollars = 0;

            foreach(Transaction trxn in transactions)
            {
                string change = "";
                decimal owed = trxn.paid - trxn.price;
                bool random = (owed*100) % 3 == 0; // Multiplying by 100 so I am able to use the mod operator since I can't use it on decimals or doubles

                if (owed > 0)
                {
                    if (random)
                    {
                        Random rnd = new Random();
                        int rollMin = 1;
                        while (owed > 0)
                        {
                            int roll = rnd.Next(rollMin, 6);
                            switch (roll)
                            {
                                case 1:
                                    if (owed >= DOLLAR_VAL)
                                    {
                                        owed -= DOLLAR_VAL;
                                        dollars++;
                                    }
                                    else
                                        rollMin = 2;
                                    break;
                                case 2:
                                    if (owed >= QUARTER_VAL)
                                    {
                                        owed -= QUARTER_VAL;
                                        quarters++;
                                    }
                                    else
                                        rollMin = 3;
                                    break;
                                case 3:
                                    if (owed >= DIMES_VAL)
                                    {
                                        owed -= DIMES_VAL;
                                        dimes++;
                                    }
                                    else
                                        rollMin = 4;
                                    break;
                                case 4:
                                    if (owed >= NICKELS_VAL)
                                    {
                                        owed -= NICKELS_VAL;
                                        nickles++;
                                    }
                                    else
                                        rollMin = 5;
                                    break;
                                case 5:
                                    if (owed >= PENNIES_VAL)
                                    {
                                        owed -= PENNIES_VAL;
                                        pennies++;
                                    }
                                    break;
                            }
                        }
                    }
                    else
                    {
                        dollars = minCalcVal(ref owed, DOLLAR_VAL);
                        quarters = minCalcVal(ref owed, QUARTER_VAL);
                        dimes = minCalcVal(ref owed, DIMES_VAL);
                        nickles = minCalcVal(ref owed, NICKELS_VAL);
                        pennies = minCalcVal(ref owed, PENNIES_VAL);
                    }


                    if (dollars > 0)
                    {
                        change = change + dollars.ToString() + (dollars > 1 ? " dollars" : " dollar");
                    }
                    if (quarters > 0)
                    {
                        change = change + (change.Length > 0 ? ", " : "") + quarters.ToString() + (quarters > 1 ? " quarters" : " quarter");
                    }
                    if (dimes > 0)
                    {
                        change = change + (change.Length > 0 ? ", " : "") + dimes.ToString() + (dimes > 1 ? " dimes" : " dime");
                    }
                    if (nickles > 0)
                    {
                        change = change + (change.Length > 0 ? ", " : "") + nickles.ToString() + (nickles > 1 ? " nickles" : " nickle");
                    }
                    if (pennies > 0)
                    {
                        change = change + (change.Length > 0 ? ", " : "") + pennies.ToString() + (pennies > 1 ? " pennys" : " penny");
                    }
                }else if (owed == 0)
                {
                    change = "Exact Change";
                }else
                {
                    change = "Invalid Transaction";
                }

                changeList.Add(change);
            }

            return changeList;
        }

        private static int minCalcVal(ref decimal owed, decimal val)
        {
            decimal count = 0;            
            decimal rmd = 0;

            decimal temp = owed;
            
            if (owed >= val)
            {
                rmd = owed % val;
                temp -= rmd;
                count = temp / val;
                owed -= (count * val);
            }

            return (int)count;
        }               
    }

}
