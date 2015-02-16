using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using CmdLine;
using System.Windows.Forms;
using System.Configuration;


namespace CashRegister
{
    public struct eachcoin_struct
    {
        public int dollars;
        public int quarters;
        public int dimes;
        public int nickels;
        public int pennies;
    }

    public class CoinChange1
    {
        private static int[] cs = new[] { 25, 10, 5, 1 };

        private List<ICollection<int>> solutions = new List<ICollection<int>>();

        public static IList<ICollection<int>> GetCoinSets(decimal total)
        {
            // Handle corner case outside of recursive solution
            if (total == 0)
                return new List<ICollection<int>>();

            // Get all possible sets
            var cc = new CoinChange1();
            cc.GetCoinSetsR(total, 0, new Stack<int>());
            return cc.solutions;
        }

        private void GetCoinSetsR(decimal n, int csi, Stack<int> combo)
        {
            // Find largest allowable coin (exploiting that cs is ordered descendingly)
            while (cs[csi] > n)
                csi++;
            int c = cs[csi];

            combo.Push(c); // Track coin selection
            if (n == c)
                solutions.Add(combo.ToArray()); // Base case
            else
                GetCoinSetsR(n - c, csi, combo); // Recursion 1: with a selected coin
            combo.Pop();

            // Recurse for all other possibilities beyond this point with a combo of smaller coin units
            if (csi < (cs.Length - 1))
                GetCoinSetsR(n, csi + 1, combo);
        }
    }
    class Program
    {
        [CommandLineArguments(Program = "CashRegister", Title = "CashRegister Conversion Program", Description = "This program converts a text file to ouput change format")]
        public class SimpleCopyArguments
        {
            [CommandLineParameter(Command = "?", Default = false, Description = "Show Help", Name = "Help", IsHelp = true)]
            public bool Help { get; set; }

            [CommandLineParameter(Name = "sourcepath", ParameterIndex = 1, Required = false, Description = "Specifies the input file path.")]
            public string SourcePath { get; set; }

         //   [CommandLineParameter(Name = "source", ParameterIndex = 2, Required = false, Description = "Specifies the file to be converted")]
         //   public string Source { get; set; }

            [CommandLineParameter(Name = "destination", ParameterIndex = 2, Required = false, Description = "Specifies the directory and/or filename for the new file(s).")]
            public string Destination { get; set; }

            [CommandLineParameter(Name = "field delimiter", ParameterIndex = 3, /*Default = "|",*/ Required = false, Description = "Specifies the field delimiter, like | or , or TAB (use t), default is |.  Enter ONLY one delimiter")]
            public string FieldDelimiter { get; set; }

            [CommandLineParameter(Command = "v", Default = false, Description = "verbose mode, show each file name for each company processed")]
            public bool Verbose { get; set; }

            [CommandLineParameter(Command = "xv", Default = false, Description = "extra verbose mode, similar to verbose mode, but show column mappings.")]
            public bool ExtraVerbose { get; set; }


          //  [CommandLineParameter(Command = "A", Required = true, Description = "Indicates an ASCII text file")]
          //  public bool ASCIITextFile { get; set; }

          //  [CommandLineParameter(Command = "B", Description = "Indicates a binary file.")]
          //  public bool BinaryFile { get; set; }

            // etc. 
        } 

        static void Main(string[] args)
        {
            try
            {
            
                SimpleCopyArguments arguments = CommandLine.Parse<SimpleCopyArguments>();
                if (arguments.ExtraVerbose) //By default, set verbose to true if extra verbose is set
                    arguments.Verbose = true;

                Char[] delimiter;
                //new Char[] { '|' /*, ','*/ }
                if (string.IsNullOrEmpty(arguments.FieldDelimiter))
                {
                    delimiter = new Char[] { ',' /*, ','*/ };
                }
                else //Assign the delimiter from the commmand line
                {
                    if (string.Equals(arguments.FieldDelimiter, "t"))
                        delimiter = new Char[] { '\t' };
                    else
                    {
                        delimiter = arguments.FieldDelimiter.ToCharArray();
                    }
                }


                //Get source and destination paths, first from command line, then from appsettings.
                string directory = "";
                if (string.IsNullOrEmpty(arguments.SourcePath))
                {
                    directory = ConfigurationManager.AppSettings["PickupDirectory"];
                }
                else
                {
                    directory = arguments.SourcePath;
                }

                string destination = "";
                if (string.IsNullOrEmpty(arguments.Destination))
                {
                    destination = ConfigurationManager.AppSettings["DropDirectory"];
                }
                else
                {
                    destination = arguments.Destination;
                }

                string directoryname = Path.GetFileName(directory);

                string[] files = Directory.GetFiles(directory, "*.txt");

                var coins = new[] { // ordered
                                 new { name = "dollar(s), ", nominal   = 1.00m }, 
                                new { name = "quarter(s), ", nominal   = 0.25m }, 
                                new { name = "dime(s), ", nominal      = 0.10m },
                                new { name = "nickel(s), ", nominal    = 0.05m },
                                new { name = "pennie(s)", nominal   = 0.01m }
                            };

                string destination_file = destination +  "output.txt";
                File.Delete(destination_file);

                using (StreamWriter sw = new StreamWriter(destination_file))
                {
                   // int count = 0;
                    foreach (var file in files)
                    {
                        var lines_input = File.ReadAllLines(file);

                        //Loop through the lines_input array, and group by company
                        for (int line_num = 0; line_num < lines_input.Count(); line_num++)
                        {

                            string[] detail_line = lines_input[line_num].Split(delimiter).Select(x => x.Trim('\"')).ToArray();

                            decimal change = Convert.ToDecimal(detail_line[1].Trim()) - Convert.ToDecimal(detail_line[0].Trim());

                            decimal remainder = (change * 100) % 3;

                            if (remainder != 0)
                            {   //If not divisible by three, use simple method to calculate minimum amount of change.
                                foreach (var coin in coins)
                                {
                                    int count = (int)(change / coin.nominal);
                                    change -= count * coin.nominal;
                                    if (count > 0)
                                    {
                                        sw.Write("{0} {1}", count, coin.name);
                                        Console.Write("{0} {1}", count, coin.name);
                                    }
                                }
                                sw.Write("\r\n");
                                Console.WriteLine();
                            }
                            else
                            {
                                //Since the change is divisible by three, use complex method to calculate all possible 
                                //amounts of physical change and randomly select one of them.

                                int whole = (int)change;
                                decimal precision = (change - whole) * 100;

                                IList<ICollection<int>> solutions = CoinChange1.GetCoinSets(precision);

                                eachcoin_struct ecoin = new eachcoin_struct();
                                ecoin.dollars = whole;
                                ecoin.quarters = ecoin.dimes = ecoin.nickels = ecoin.pennies = 0;

                                //Generate a random number, based on the number of physical change solutions, 
                                //so we can randomly select one of the returned change solutions.
                                Random r = new Random();
                                int rInt = r.Next(0, solutions.Count() - 1); 

                                ICollection<int> solution = solutions[rInt];

                                foreach (int eachcoin in solution)
                                {
                                    switch (eachcoin)
                                    {
                                        case 1:
                                            ecoin.pennies++;
                                            break;
                                        case 5:
                                            ecoin.nickels++;
                                            break;
                                        case 10:
                                            ecoin.dimes++;
                                            break;
                                        case 25:
                                            ecoin.quarters++;
                                            break;
                                    }
                                }

                                if (ecoin.dollars > 0)
                                {
                                    sw.Write("{0} dollar(s), {1} quarter(s), {2} dime(s), {3} nickel(s), {4} pennie(s)", ecoin.dollars, ecoin.quarters, ecoin.dimes, ecoin.nickels, ecoin.pennies);
                                    Console.Write("{0} dollar(s), {1} quarter(s), {2} dime(s), {3} nickel(s), {4} pennie(s)", ecoin.dollars, ecoin.quarters, ecoin.dimes, ecoin.nickels, ecoin.pennies);
                                }
                                else
                                {
                                    sw.Write("{0} quarter(s), {1} dime(s), {2} nickel(s), {3} pennie(s)", ecoin.quarters, ecoin.dimes, ecoin.nickels, ecoin.pennies);
                                    Console.Write("{0} quarter(s), {1} dime(s), {2} nickel(s), {3} pennie(s)", ecoin.quarters, ecoin.dimes, ecoin.nickels, ecoin.pennies);
                                }
                                
                                sw.Write("\r\n");
                                Console.WriteLine();
                            }

                        }

                    }//end for loop reading all input files

                }
            }
            catch (CommandLineException exception)
            {
                Console.WriteLine(exception.ArgumentHelp.Message);
                Console.WriteLine(exception.ArgumentHelp.GetHelpText(Console.BufferWidth));
                // Or show it in a message box if you like. 
                //  MessageBox.Show(exception.ArgumentHelp.GetHelpText(Console.BufferWidth));
            }
            catch (Exception ex)
            {
#if WANTED              
                using (MailMessage message = new MailMessage())
                {
                    message.To.Add(ConfigurationManager.AppSettings["emailSummaryAddress"]);
                    message.From = new MailAddress("sidor@pobox.com");
                    message.Subject = "CashRegister (EXCEPTION)";
                    message.IsBodyHtml = true;
                    message.Body = ex.ToString();
                    using (SmtpClient client = new SmtpClient())
                    {
                        client.Send(message);
                    }
                }
#endif

            }
        }
    }
}


