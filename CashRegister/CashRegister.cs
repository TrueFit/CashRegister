using System;
using System.Configuration;
using System.IO;
using CashRegisterLib;

namespace CashRegister
{
    class CashRegister
    {
        public static void Main(string[] args)
        {

            if (args.Length != 2)
            {
                Console.Error.WriteLine("Expecting 2 parameters - inputFile and outputFile");
                return;
            }

            try
            {
                string inputFile = args[0];
                string outputFile = args[1];

                int.TryParse(ConfigurationManager.AppSettings["randomDivisor"], out var randomDivisor);

                using (var fileIn = new StreamReader(inputFile))
                using (var fileOut = new StreamWriter(outputFile))
                {
                    while (!fileIn.EndOfStream)
                    {
                        IChangeCalculator calc;

                        var amounts = fileIn.ReadLine().Split(',');
                        var cost = decimal.Parse(amounts[0]);
                        var tender = decimal.Parse(amounts[1]);
                        var transaction = new CashTransaction(cost, tender);


                        if (randomDivisor != 0 && Math.Round(cost * 100,0) % randomDivisor == 0)
                        {
                            calc = new RandomChangeCalculator();
                        }
                        else
                        {
                            calc = new StandardChangeCalculator();
                        }

                        fileOut.WriteLine(transaction.GetChangeDue(calc));
                    }
                }
            }
            catch(FileNotFoundException e)
            {
                Console.Error.WriteLine("File {0} not found.", e.FileName);
            }
            catch(Exception e)
            {
                Console.Error.WriteLine(e.Message);
            }
        }
    }
}
