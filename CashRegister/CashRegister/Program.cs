using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace CashRegister
{
    class Program
    {
        static void Main(string[] args)
        {
            Change change = new Change();

            List<RegisterTransaction> transactions;
            if (args.Length > 0)
            {
                transactions = ReadFile(args[0]);
            }
            else
            {
                transactions = ReadFile("tests.txt");
            }

            foreach (RegisterTransaction trans in transactions)
            {
                trans.change = change.GetChange(trans.total, trans.paid);
                Console.WriteLine(trans.change);
            }

            Console.ReadLine();
        }

        static List<RegisterTransaction> ReadFile(string filename)
        {
            string line;
            string[] splitLine;
            decimal total, paid;
            List<RegisterTransaction> transactions = new List<RegisterTransaction>();
            try
            {
                StreamReader file = new StreamReader(filename);
                while ((line = file.ReadLine()) != null)
                {
                    splitLine = line.Split(',');
                    if (splitLine.Length == 2)
                    {
                        if (decimal.TryParse(splitLine[0], out total) && (decimal.TryParse(splitLine[1], out paid)))
                        {
                            //not the cleanest way to do this
                            transactions.Add(new RegisterTransaction { total = total, paid = paid });
                            Console.Write("Added -> ");
                        }
                    }
                    Console.WriteLine(line);
                }

                file.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("There was a problem with the file you chose. Closing.");
                Console.WriteLine(ex.ToString());
            } 


            return transactions;
        }
    }
}
