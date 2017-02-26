using System;
using System.Collections.Generic;
using System.Configuration;
using System.Text;

namespace CashRegister
{
    
    class Program
    {
        static Random rnd = new Random();

        /// <summary>
        /// Gets Names of each money denomination.
        /// </summary>
        /// <returns>List of money denomination names.</returns>
        public static List<string> GetDenominationNames(string keyName) 
        {
            var denominationNames = new List<string>();
            var numDenoms = Convert.ToInt32(ConfigurationManager.AppSettings["NumberOfDenominations"]);
            

            for (int i = 0; i < numDenoms; i++)
            {    
                var denomination = ConfigurationManager.AppSettings[keyName + i];
                denominationNames.Add(denomination);
            }
                        
            return denominationNames;
        }

        /// <summary>
        /// Gets Values of each money denomination.
        /// </summary>
        /// <returns>List of money denomination values.</returns>
        public static List<int> GetDenominationValues()
        {
            var denominationValues = new List<int>();
            var numDenoms = Convert.ToInt32(ConfigurationManager.AppSettings["NumberOfDenominations"]);

            for (int i = 0; i < numDenoms; i++)
            {
                var value = Convert.ToInt32(ConfigurationManager.AppSettings["DenominationValue" + i]);
                denominationValues.Add(value);
            }

            return denominationValues;
        }

        /// <summary>
        /// Determines the number of each denomination required to properly make change.
        /// </summary>
        /// <param name="change">Amount of change.</param>
        /// <param name="denominationValues">Values of the money denominations.</param>
        /// <param name="denominationNames">Names for each denomination.</param>
        /// <param name="isDivisibleBy3">Indication of whether or not the amount paid is divisible by 3.</param>
        /// <returns></returns>
        public static Dictionary<string, int> CreateChange(int change, List<int> denominationValues, List<string> denominationNames, bool isDivisibleBy3)
        {
            var denominationsUsedDict = new Dictionary<string, int>();
            var indicesUsed = new HashSet<int>();
            
            if(!isDivisibleBy3)
            {
                for (int i = 0; i < denominationValues.Count; i++)
                {
                    var numItems = change / denominationValues[i];
                    change %= denominationValues[i];
                    denominationsUsedDict.Add(denominationNames[i], numItems);
                }
            }
            else
            {
                while((indicesUsed.Count < denominationValues.Count) && (change != 0))
                {
                    var index = rnd.Next(denominationValues.Count);
                    if(indicesUsed.Contains(index))
                    {
                        continue;
                    }

                    indicesUsed.Add(index);
                    var numItems = change / denominationValues[index];
                    change %= denominationValues[index];
                    denominationsUsedDict.Add(denominationNames[index], numItems);
                }
            }
            
            return denominationsUsedDict;
        }

        /// <summary>
        /// Generates the string output.
        /// </summary>
        /// <param name="denominationNames">Names of the money denominations.</param>
        /// <param name="moniesUsedDict">Dictionary containing the amounts of each denomination used.</param>
        /// <returns></returns>
        public static string GenerateOutput(List<string> denominationNames, List<string> pluralDenomination, Dictionary<string, int> moniesUsedDict)
        {
            var output = new StringBuilder();

            for (int i = 0; i < denominationNames.Count; i++)
            {
                var name = denominationNames[i];
                if (!moniesUsedDict.ContainsKey(name))
                {
                    continue;
                }

                var numUsed = moniesUsedDict[name];
                if(numUsed == 0)
                {
                    continue;
                }

                //use plural name
                if(numUsed > 1)
                {
                    name = pluralDenomination[i];
                }

                var entry = $@"{numUsed} {name}, ";
                output.Append(entry);
            }

                        
            output.Remove(output.Length - 2, 2);
            output.Append(".");
            output.Append(Environment.NewLine);

            return output.ToString();
        }


        static void Main(string[] args)
        {
            bool isDivisibleBy3 = false;
            var register = new CashRegister();
            var fileUtil = new FileProcessorUtil(@"E:\My Documents\Projects\CashRegister\CashRegister\input.txt");
            var denominationNames = GetDenominationNames("DenominationName");
            var pluralDenominationNames = GetDenominationNames("DenominationNamePlural");
            var denominationValues = GetDenominationValues();
            StringBuilder output = new StringBuilder();
            
            foreach(string sale in fileUtil.Transactions)
            {
                var transactionSet = sale.Split(',');
                register.Action = new Sale();
                register.Action.Cost = (int)(Convert.ToDouble(transactionSet[0]) * 100);
                register.Action.AmountPaid = (int)Convert.ToDouble(transactionSet[1]) * 100;

                isDivisibleBy3 = register.Action.Cost  % 3  == 0 ? true : false;
                var change = register.Action.PerformTransaction();
                var moneyUsed = CreateChange(change, denominationValues, denominationNames, isDivisibleBy3);
                output.Append(GenerateOutput(denominationNames, pluralDenominationNames, moneyUsed));
            }

            fileUtil.Change = output.ToString();
            fileUtil.WriteToFile(@"E:\My Documents\Projects\CashRegister\CashRegister\output.txt");
            
        }
    }
}
