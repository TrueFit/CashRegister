using CashRegister.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CashRegister.Objects;

namespace CashRegister.Services
{
    public class CsvRecordService : ICsvRecordService
    {
        public void ProcessRecords(List<CsvRecord> records, IOutputFileService outputFileService)
        {
            var changeService = new ChangeService();
            
            foreach (var record in records)
            {
                decimal totalCost, amtPaid;
                if (decimal.TryParse(record.TotalCost, out totalCost) && decimal.TryParse(record.AmountPaid, out amtPaid))
                {
                    var change = changeService.CalculateChange(totalCost, amtPaid);
                    outputFileService.WriteLine(
                        string.Format("Total Cost: {0}, Amount Paid: {1}, Change In Cents: {2}, Change in Denominations: {3}", 
                            totalCost, 
                            amtPaid, 
                            change, 
                            changeService.ConvertChangeToDenominations(change, totalCost % (totalCost / 3) == 0)
                        )
                    );
                }
                else
                    outputFileService.WriteLine(string.Format("Cannot convert either {0} or {1} to a dollar value to process.", record.TotalCost, record.AmountPaid));                
            }
        }
    }
}
