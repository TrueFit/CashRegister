using CashRegister.Server.Data;
using CashRegister.Server.Models;

namespace CashRegister.Server.Utilities
{
    public class CurrencyOptionsUtil
    {
        public static IEnumerable<Currency> GetCurrencies()
        {
            IEnumerable<Currency> currencyData = [];

            using (var context = new ApplicationDbContext())
            {
                context.Database.EnsureCreated();

                currencyData = context.Currencies.Select(
                    c => new Currency() { 
                        CurrencyCode = c.CurrencyCode, 
                        Name = c.Name 
                    }).ToList();
            }

            return currencyData;
        }
    }
}
