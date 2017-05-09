using CashRegister.Objects;
using System.Collections.Generic;

namespace CashRegister.Services.Contracts
{
    public interface ICsvRecordService
    {
        void ProcessRecords(List<CsvRecord> records, IOutputFileService outputFileService);
    }
}
