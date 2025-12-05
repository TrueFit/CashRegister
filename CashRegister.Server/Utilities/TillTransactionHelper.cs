using CashRegister.Server.Data;
using CashRegister.Server.Models;

namespace CashRegister.Server.Utilities
{
    public class TillTransactionHelper(string currency = "USD", int randomDivisor = 3)
    {
        private readonly string currency = currency;
        private readonly int randomDivisor = randomDivisor;

        private List<Change> retVal = [];

        public IEnumerable<Change> CalcChange(decimal due, decimal paid)
        {
            retVal = [];
            var change = paid - due;
            var dueInCents = Math.Round(due * 100);

            using (var context = new ApplicationDbContext())
            {
                context.Database.EnsureCreated();

                var currencyData = context.Currencies.First(c => c.CurrencyCode == currency);

                if (dueInCents % randomDivisor == 0)
                {
                    GetRandomChange(currencyData, change);
                }
                else
                {
                    GetChange(currencyData, change);
                }
            }

            return retVal;
        }

        private void GetChange(Currency currencyData, decimal change)
        {
            var remaining = change;
            var orderedDenoms = currencyData.Denominations.OrderByDescending(d => d.Value);

            //This logic ignores change in any amount less that the currencies minimum denomination
            while (remaining >= orderedDenoms.Last().Value)
            {
                var currentDenom = orderedDenoms.First(d => d.Value <= remaining);
                int count = (int)Math.Floor(remaining/currentDenom.Value);

                retVal.Add(new Change { Count = count, Denomination = (count > 1 ? currentDenom.Plural : currentDenom.Name) });
                remaining -= count * currentDenom.Value;
            }
        }

        private void GetRandomChange(Currency currencyData, decimal change)
        {
            var remaining = change;
            var orderedDenomsList = currencyData.Denominations.OrderByDescending(d => d.Value).ToList();

            //This logic ignores change in any amount less that the currencies minimum denomination
            while (remaining >= orderedDenomsList.Last().Value)
            {
                var currentMaxDenomIndex = orderedDenomsList
                    .Select((d, i) => new { D = d, Index = i })
                    .First(o => o.D.Value <= remaining)
                    .Index;
                var randomDenom = orderedDenomsList[(new Random()).Next(currentMaxDenomIndex, orderedDenomsList.Count - 1)];

                int maxCount = (int)Math.Floor(remaining / randomDenom.Value);
                int randomCount = (new Random()).Next(1, maxCount);

                if (randomCount > 0)
                {
                    var existingDenom = retVal.Find(c => c.Denomination == randomDenom.Plural || c.Denomination == randomDenom.Name);

                    if (existingDenom?.Count > 0)
                    {
                        existingDenom.Count += randomCount;
                        existingDenom.Denomination = randomDenom.Plural;
                    }
                    else
                    {
                        retVal.Add(new Change { Count = randomCount, Denomination = (randomCount > 1 ? randomDenom.Plural : randomDenom.Name) });
                    }

                    remaining -= randomCount * randomDenom.Value;
                }
            }
        }
    }
}
