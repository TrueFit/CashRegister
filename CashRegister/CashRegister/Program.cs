using Calculator;
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
        // Arguments Input File, Output File, Random Divisor, Special Rule, Locale
        // Random divisor defaults to 3
        // Special Rule can be a second random divosor to be used if the random divisor is false
        // Local defaults to US but can be FR for France
        //
        // The class Calculator is consumable.
        static void Main(string[] args)
        {
            Calculator.Calculator m_oCalculator = new Calculator.Calculator();
            
            if (!valid(args, m_oCalculator))
            {
                return;
            }

            try
            {
                using (StreamReader m_oStreamReader = new StreamReader(args[0]))
                {
                    using (StreamWriter m_oStreamWriter = new StreamWriter(args[1]))
                    {
                        while (!m_oStreamReader.EndOfStream)
                        {
                            string strInLine = m_oStreamReader.ReadLine();
                            var varValues = strInLine.Split(',');
                            m_oCalculator.AmountDue = Convert.ToDouble(varValues[0]);
                            m_oCalculator.AmountTendered = Convert.ToDouble(varValues[1]);
                            m_oCalculator.CalculateChange();
                            m_oStreamWriter.WriteLine(FormatLine(m_oCalculator));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private static string FormatLine(Calculator.Calculator Calculator)
        {
            string strChange = "";
            string strDollars = "dollars";
            string strQuarters = "quarters";
            string strDimes = "dimes";
            string strNickels = "nickels";
            string strPennies = "pennies";

            if (Calculator.Locale != "US")
            {
                strDollars = "Euro dollars";
                strQuarters = "Euro quarters";
                strDimes = "Euro dimes";
                strNickels = "Euro nickels";
                strPennies = "Euro pennies";
            }

            if (Calculator.Dollars > 0)
            {
                if (strChange.Length > 0)
                {
                    strChange += ",";
                }

                strChange = strChange += string.Format("{0} {1}", Calculator.Dollars, strDollars);
            }

            if (Calculator.Quarters > 0)
            {
                if (strChange.Length > 0)
                {
                    strChange += ",";
                }

                strChange = strChange += string.Format("{0} {1}", Calculator.Quarters, strQuarters);
            }

            if (Calculator.Dimes > 0)
            {
                if (strChange.Length > 0)
                {
                    strChange += ",";
                }

                strChange = strChange += string.Format("{0} {1}", Calculator.Dimes, strDimes);
            }

            if (Calculator.Nickels > 0)
            {
                if (strChange.Length > 0)
                {
                    strChange += ",";
                }

                strChange = strChange += string.Format("{0} {1}", Calculator.Nickels, strNickels);
            }

            if (Calculator.Pennies > 0)
            {
                if (strChange.Length > 0)
                {
                    strChange += ",";
                }

                strChange = strChange += string.Format("{0} {1}", Calculator.Pennies, strPennies);
            }

            return strChange;
        }
        private static bool valid(string[] args, Calculator.Calculator Calculator)
        {
            if (args == null || args.Length == 0)
            {
                Console.WriteLine("Arguments Input File, Output File, Random Divisor, Special Rule, Locale");
                Console.WriteLine("Random divisor defaults to 3");
                Console.WriteLine("Special Rule can be a second random divosor to be used if the random divisor is false");
                Console.WriteLine("Local defaults to US but can be FR for France");
                Console.WriteLine("Input file not specified");

                return false;
            }

            if (args.Length == 1)
            {
                Console.WriteLine("Output file not specified");

                return false;
            }

            if (args.Length >= 3)
            {
                try
                {
                    Calculator.RandomDivisor = Convert.ToInt32(args[2]);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.Message);

                    return false;
                }
            }

            if (args.Length >= 4)
            {
                try
                {
                    Calculator.SpecialRule = Convert.ToInt32(args[3]);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.Message);

                    return false;
                }
            }

            if (args.Length == 5)
            {
                if (args[4] != "US" && args[4] != "FR")
                {
                    Console.WriteLine("Locale must be US or FR");

                    return false;
                }
                else
                {
                    Calculator.Locale = args[4];
                }
            }

            return true;
        }
    }
}
