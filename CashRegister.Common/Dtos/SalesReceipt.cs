using System.Collections.Generic;

namespace CashRegister.Common.Dto
{
    public class SalesReceipt
    {
        public SalesReceipt(IEnumerable<SaleItem> saleItems)
        {
            SaleItems = saleItems;
        }

        public IEnumerable<SaleItem> SaleItems { get; private set; }
    }
}
