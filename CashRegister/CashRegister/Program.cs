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
            string filename;
            if (args.Length > 0)
            {
                filename = args[0];
            }
            else
            {
                Console.WriteLine("Please enter a file name to parse: ");
                filename = Console.ReadLine();
            }

            List<RegisterTransaction> transactions;
            transactions = ReadFile(filename);

            foreach (RegisterTransaction trans in transactions)
            {
                trans.change = change.GetChange(trans.total, trans.paid);
                Console.WriteLine(trans.change);
            }

            Console.WriteLine("Press enter to exit.");
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
                    // if there are fewer or more than 2 items, the input line is invalid
                    if (splitLine.Length == 2)
                    {
                        // verify input
                        if (decimal.TryParse(splitLine[0], out total) && (decimal.TryParse(splitLine[1], out paid)))
                        {
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
