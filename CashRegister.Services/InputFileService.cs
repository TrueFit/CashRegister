using CashRegister.Objects;
using CashRegister.Services.Contracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

namespace CashRegister.Services
{
    public class InputFileService : IInputFileService
    {
        public void ProcessLocalInputFile(string inputPath, IOutputFileService outputFileService)
        {
            ProcessStreamReader(new StreamReader(inputPath), outputFileService);            
        }

        public void ProcessStreamReader(StreamReader sr, IOutputFileService outputFileService)
        {
            List<CsvRecord> records = new List<CsvRecord>();
            using (sr)
            {
                string record;
                while ((record = sr.ReadLine()) != null)
                {
                    if (!string.IsNullOrWhiteSpace(record) && record.Contains(","))
                    {
                        string[] array = record.Split(',');
                        records.Add(new CsvRecord
                        {
                            TotalCost = array[0],
                            AmountPaid = array[1]
                        });
                    }
                }
            }

            var csvRecordService = new CsvRecordService();
            csvRecordService.ProcessRecords(records, outputFileService);
        }
    }
}
