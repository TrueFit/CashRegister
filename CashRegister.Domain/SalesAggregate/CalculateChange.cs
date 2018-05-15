using CSharpFunctionalExtensions;
using MediatR;
using System.Collections.Generic;
using System.Linq;

namespace CashRegister.Domain.SalesAggregate
{
    public class CalculateChange : IRequest
    {
        private CalculateChange(IEnumerable<SaleItem> saleItems)
        {
            SaleItems = saleItems;
        }

        public IEnumerable<SaleItem> SaleItems { get; private set; }

        public static Result<CalculateChange> Create(SalesReceipt receipt)
        {
            if (receipt.SaleItems == null || receipt.SaleItems.Any() == false)
            {
                return Result.Fail<CalculateChange>("No items found in sales receipt.");
            }

            // Additional validation here - negative $? Should that happen?

            return Result.Ok(new CalculateChange(receipt.SaleItems));
        }
    }
}
