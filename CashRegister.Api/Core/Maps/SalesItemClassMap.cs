using CashRegister.Domain.SalesAggregate;
using CsvHelper.Configuration;

namespace CashRegister.Api.Core.Maps
{
    public sealed class SaleItemClassMap : ClassMap<SaleItem>
    {
        public SaleItemClassMap()
        {
            Map(m => m.AmountOwed).Index(0);
            Map(m => m.AmountPaid).Index(1);
        }
    }
}