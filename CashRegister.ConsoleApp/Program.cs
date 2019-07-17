using CashRegister.Core;
using CashRegister.Core.Enums;
using System;
using System.IO;

namespace CashRegister.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Enter path to file: ");
            string path = Console.ReadLine();

            if (File.Exists(path))
            {
                // Display formats
                Console.WriteLine("\nAvailable formats: ");
                int count = 0;
                foreach (var layout in Enum.GetValues(typeof(Layouts)))
                {
                    Console.WriteLine("    [" + count.ToString() + "] " + layout.ToString());
                    count++;
                }

                Console.Write("Select format to use: ");
                int selected = Convert.ToInt32(Console.ReadLine());

                // If a valid layout is selected
                if(selected >= 0 && selected < count)
                {
                    string outPath = Path.GetDirectoryName(path) + Path.DirectorySeparatorChar.ToString() + Path.GetFileNameWithoutExtension(path) + "_out.txt" ;

                    // Load the ledger with transactions and calculate change
                    var register = new Register();
                    register.Layout = (Layouts) Enum.GetValues(typeof(Layouts)).GetValue(selected);
                    register.LoadFromFile(path);
                    register.Calculate();
                    var changeString = register.ToString();

                    // Write output
                    register.WriteToFile(outPath);
                    Console.WriteLine("\nOutput written to: " + outPath);
                }
                else
                {
                    Console.WriteLine("Invalid layout selected");
                }
            }
            else
            {
                Console.WriteLine("Invalid file path entered.");
            }

            Console.WriteLine("\nPress any key to close...");
            Console.ReadKey();
        }
    }
}
