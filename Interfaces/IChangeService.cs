using CsvHelper;
using System.Collections.Generic;
using System.IO;

namespace Interfaces
{
    public interface IChangeService
    {
         string Delimiter { get; set; }
         string CurrencyCode { get; set; }
         ICurrency CurrentCurrency { get; set; }
         int Divisor { get; set; }

        List<string> Process(Stream fileStream);

        (bool success, decimal amtDue, decimal amtPaid) ReadDecimalValuesFromRow(IReader csvReader);
        string GetChange(decimal amtDue, decimal amtPaid);
        
        /// <summary>
        /// Uses Reflection to find ICurrency implementations in the DomainModels assembly
        /// Returns the one whose CurrencyCode matches
        /// Defaults to USDollar if it cannot find a match
        /// </summary>
        /// <param name="currencyCode"></param>
        /// <returns></returns>
        ICurrency GetCurrency(string currencyCode);


    }
}
