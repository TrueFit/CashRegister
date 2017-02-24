using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using CashRegister.Helpers;

namespace CashRegister
{
    class Program
    {
        /// <summary>
        /// This cash register helper method is exposed through a console app for IO.
        /// </summary>
        /// <param name="args"></param>
        static void Main(string[] args)
        {
            try
            {
                //Read input file name
                Console.WriteLine("Please enter file name");
                var fileName = Console.ReadLine();

                //Lists of input and output data
                List<Tuple<decimal, decimal>> paidList = new List<Tuple<decimal, decimal>>();
                List<string> returnedChangeList = new List<string>();
                
                //US Currency change list.  Change lists consist of a decimal amount, as well as singular and plural string names.
                Dictionary<decimal, Tuple<string, string>> change = new Dictionary<decimal, Tuple<string, string>>()
                {
                    { .01m, new Tuple<string, string>("penny", "pennies") },
                    { .05m, new Tuple<string, string>("nickel", "nickels") },
                    { .10m, new Tuple<string, string>("dime", "dimes") },
                    { .25m, new Tuple<string, string>("quarter", "quarters") },
                    { 1.00m, new Tuple<string, string>("one dollar bill", "one dollar bills") },
                    { 5.00m, new Tuple<string, string>("five dollar bill", "five dollar bills") },
                    { 10.00m, new Tuple<string, string>("ten dollar bill", "ten dollar bills") },
                    { 20.00m, new Tuple<string, string>("twenty dollar bill", "twenty dollar bills") },
                    { 50.00m, new Tuple<string, string>("fifty dollar bill", "fifty dollar bills") },
                    { 100.00m, new Tuple<string, string>("one hundred dollar bill", "one hundred dollar bills") }
                };

                var fileLine = File.ReadAllLines(fileName).ToList();
                foreach (var line in fileLine)
                {
                    var prices = line.Split(',');

                    //Valid line
                    if (prices.Count() == 2)
                    {
                        decimal paid, price;

                        //Valid decimals
                        if (decimal.TryParse(prices[0], out paid) && decimal.TryParse(prices[1], out price))
                        {
                            paidList.Add(new Tuple<decimal, decimal>(paid, price));
                        }
                    }
                }

                //Make some change
                foreach (var transaction in paidList)
                {
                    var returnedChange = Register.Instance.MakeChange(transaction, change);
                    returnedChangeList.Add(returnedChange);
                }

                //Write change to new file
                var newFileName = fileName.Replace(".txt", "_output.txt");
                File.WriteAllLines(newFileName, returnedChangeList);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
