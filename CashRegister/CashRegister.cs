using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using log4net;

namespace CashRegister
{
    internal class CashRegister : ICashRegister
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(CashTranslator));
        
        public IList<string> GetChangeList(string dataLocation)
        {
            var data = new List<string>();
            var fileExist = File.Exists(@dataLocation);

            if (fileExist)
            {
                var cashfile = File.ReadLines(@dataLocation);
                if (!cashfile.Any())
                {
                    Log.Debug("No record found in the file specified");
                    return null;
                };

                data.AddRange(CashTranslator.Translate(cashfile));
            }
            else
            {
                throw new FileNotFoundException(String.Format("The data location {0} does not exist please check the location specified and try again", dataLocation));
            }

            return data;
        }

        public void PrintChange(IEnumerable<string> changeList)
        {
            foreach (var change in changeList)
            {
                Console.WriteLine(change);
            }
        }
    }
}
