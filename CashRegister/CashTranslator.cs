using System;
using System.Collections.Generic;
using System.Linq;
using log4net;

namespace CashRegister
{
    public class CashTranslator
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(CashTranslator));
        public  static IEnumerable<string> Translate(IEnumerable<string> lines)
        {
            var changeList = new List<string>();
            
            try
            {
                foreach (var line in lines)
                {
                    if (!string.IsNullOrEmpty(line))
                    {
                        var change = new CashFormat();
                        var splitChange = Split(line);

                        if (splitChange.IntegerPart > 0)
                            change.DollarAmount = splitChange.IntegerPart;

                        if (splitChange.DecimalPart > 0)
                            ConvertDecimalPart(splitChange, change);

                        string changeString = ConvertChangeValueToString(change);
                        Log.Debug(String.Format("Return a change of {0} to customer.", changeString));
                        changeList.Add(changeString);
                    }
                }
                return changeList;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return null;
            }
            
        }
        /// <summary>
        /// Convert just the decimal part of the change and also
        /// assign a random denomination that makes sense if the value is devisible by 3
        /// </summary>
        /// <param name="file"></param>
        /// <param name="change"></param>
        private static void ConvertDecimalPart(CashFileStructure file, CashFormat change)
        {
            var divisors = new List<int>(){25, 10, 5, 1};
            var remainder = file.DecimalPart;
            
            if (file.OwedAmountDivisibleByThree)
            {
                var random = new Random();
                
                while (remainder >= 1)
                {
                    if (remainder < 5)
                    {
                        change.PennyAmount = +remainder;
                        remainder = 0;
                    }

                    var randomDivisor = divisors[random.Next(divisors.Count)];

                    //we dont want to give out too much of one denomitaion 
                    var notTooMuch = remainder/randomDivisor < 13;
                    
                    if (remainder > randomDivisor)
                    {
                        if (notTooMuch)
                        {
                            AssignDenomination(randomDivisor, randomDivisor, change);
                            remainder = remainder - randomDivisor;
                        }
                        else
                        {
                            if ((change.PennyAmount == 10 && randomDivisor == 1) ||
                                (change.NickelAmount == 10 && randomDivisor == 5)) continue;

                            AssignDenomination(randomDivisor, randomDivisor, change);
                            remainder = remainder - randomDivisor;
                        }

                    }
                    else
                    {
                        divisors.Remove(randomDivisor);
                    }
                }
                
                return;
            }
            foreach (var divisor in divisors)
            {
                AssignDenomination(remainder, divisor, change);
                var mod = remainder % divisor;
                remainder = mod;
            }
        }
        /// <summary>
        /// Determine the demomination to give base of the divisor
        /// </summary>
        /// <param name="remainder"></param>
        /// <param name="divisor"></param>
        /// <param name="change"></param>
        private static void AssignDenomination(int remainder, int divisor, CashFormat change)
        {
            var div = remainder / divisor;
            switch (divisor)
            {
                case 25:
                    change.QuaterAmount += div;
                    break;
                case 10:
                    change.DimeAmount += div;
                    break;
                case 5:
                    change.NickelAmount += div;
                    break;
                default:
                    change.PennyAmount += div;
                    break;
            }
        }
        /// <summary>
        /// Split the owed amount and the Paid amount
        /// Get the change and also convet to int
        /// </summary>
        /// <param name="line"></param>
        /// <returns></returns>
        private static CashFileStructure Split(string line)
        {
            var splittedUp = new CashFileStructure();
            var amountOwedAndAmountPaid = line.Split(',');
            
            var amountOwed = Convert.ToDecimal(amountOwedAndAmountPaid[0].Trim());
            var amountPaid = Convert.ToDecimal(amountOwedAndAmountPaid[1].Trim());
            
            var change = amountPaid - amountOwed;

            var changeString = change.ToString();

            Log.Debug(String.Format("Amount taken: {0}, amount owe: {1}, change: {2}", amountOwedAndAmountPaid[1], amountOwedAndAmountPaid[0], changeString));
            
            var splitChange = changeString.Split('.');

            splittedUp.IntegerPart = int.Parse(splitChange[0]);
            splittedUp.DecimalPart = splitChange.Length == 2
                ? int.Parse(splitChange[1].Length > 2
                    ? splitChange[1].Substring(0, 2)
                    : splitChange[1])
                : 0;
            if ((amountOwed * 100)%3 == 0)
                splittedUp.OwedAmountDivisibleByThree = true;

            return splittedUp;
        }
        /// <summary>
        /// Give meaning to the change by adding denominations and return a string
        /// </summary>
        /// <param name="change"></param>
        /// <returns></returns>
        private static string ConvertChangeValueToString(CashFormat change)
        {
            var finalString = new List<string>();
            string changeString = null;
            if (change.DollarAmount != 0)
            {
                finalString.Add(change.DollarAmount > 1
                    ? String.Format("{0} dollars", change.DollarAmount)
                    : String.Format("{0} dollar", change.DollarAmount));
            }

            if (change.QuaterAmount != 0)
            {
                finalString.Add(change.QuaterAmount > 1
                    ? String.Format("{0} quaters", change.QuaterAmount)
                    : String.Format("{0} quater", change.QuaterAmount));
            }

            if (change.DimeAmount != 0)
            {
                finalString.Add(change.DimeAmount > 1
                    ? String.Format("{0} dimes", change.DimeAmount)
                    : String.Format("{0} dime", change.DimeAmount));
            }

            if (change.NickelAmount != 0)
            {
                finalString.Add(change.NickelAmount > 1
                    ? String.Format("{0} nickels", change.NickelAmount)
                    : String.Format("{0} nickel", change.NickelAmount));
            }

            if (change.PennyAmount != 0)
            {
                finalString.Add(change.PennyAmount > 1
                    ? String.Format("{0} pennnies", change.PennyAmount)
                    : String.Format("{0} penny", change.PennyAmount));
            }
            if (finalString.Any())
            {
                changeString = string.Join(", ", finalString); 
            }

            return changeString;
        }
    }
}
