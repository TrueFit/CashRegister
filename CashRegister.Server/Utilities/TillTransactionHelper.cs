using CashRegister.Server.Data;
using CashRegister.Server.Models;

namespace CashRegister.Server.Utilities
{
    public class TillTransactionHelper(string currency = "USD")
    {
        private readonly string currency = currency;

        public IEnumerable<Change> calcChange(decimal due, decimal paid)
        {
            var retVal = new List<Change>();

            using (var context = new ApplicationDbContext())
            {
                context.Database.EnsureCreated();

                var currencyData = context.Currencies.First(c => c.CurrencyCode == currency);
                retVal.Add(new Change { Count = 1, Denomination = "quarter" });
            }

            return retVal;
        }
    }
}
