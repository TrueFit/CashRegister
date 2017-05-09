using CashRegister.Objects;
using CashRegister.Services.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CashRegister.Services
{
    public class ChangeDenominationService : IChangeDenominationService
    {
        private List<ChangeDenomination> _denominations = new List<ChangeDenomination>()
        {
            new ChangeDenomination { SingularName = "Hundred Dollar Bill", PluralName = "Hundred Dollar Bills", ValueInCents = 10000, Index = 1 },
            new ChangeDenomination { SingularName = "Fifty Dollar Bill", PluralName = "Fifty Dollar Bills", ValueInCents = 5000, Index = 2 },
            new ChangeDenomination { SingularName = "Twenty Dollar Bill", PluralName = "Twenty Dollar Bills", ValueInCents = 2000, Index = 3 },
            new ChangeDenomination { SingularName = "Ten Dollar Bill", PluralName = "Ten Dollar Bills", ValueInCents = 1000, Index = 4 },
            new ChangeDenomination { SingularName = "Five Dollar Bill", PluralName = "Five Dollar Bills", ValueInCents = 500, Index = 5 },
            new ChangeDenomination { SingularName = "One Dollar Bill", PluralName = "One Dollar Bills", ValueInCents = 100, Index = 6 },
            new ChangeDenomination { SingularName = "Quarter", PluralName = "Quarters", ValueInCents = 25, Index = 7 },
            new ChangeDenomination { SingularName = "Dime", PluralName = "Dimes", ValueInCents = 10, Index = 8 },
            new ChangeDenomination { SingularName = "Nickel", PluralName = "Nickels", ValueInCents = 5, Index = 9 },
            new ChangeDenomination { SingularName = "Penny", PluralName = "Pennies", ValueInCents = 1, Index = 10 }
        };

        public string CalculateRandomChangeDenominations(int changeInCents)
        {
            List<Tuple<int, ChangeDenomination>> outputItems = new List<Tuple<int, ChangeDenomination>>();
            List<int> usedDenominations = new List<int>();

            while (changeInCents > 0)
            {
                var r = new Random();
                var randIndex = r.Next(1, _denominations.Count());
                if (!usedDenominations.Any(i => i == randIndex))
                {
                    usedDenominations.Add(randIndex);
                    var cd = _denominations[randIndex];

                    if (changeInCents >= cd.ValueInCents)
                    {
                        var quantity = changeInCents / cd.ValueInCents;
                        var quantityValue = quantity * cd.ValueInCents;

                        outputItems.Add(new Tuple<int, ChangeDenomination>(quantity, cd));
                        changeInCents = changeInCents - quantityValue;
                    }
                }
            }

            return string.Join(", ", outputItems.OrderBy(t => t.Item2.Index).Select(s => string.Format("{0} {1}", s.Item1, s.Item1 > 1 ? s.Item2.PluralName : s.Item2.SingularName)));
        }

        public string CalculateStandardChangeDenominations(int changeInCents)
        {
            List<string> outputItems = new List<string>();
            
            foreach (var cd in _denominations.OrderBy(x => x.Index))
            {
                if (changeInCents >= cd.ValueInCents)
                {
                    var quantity = changeInCents / cd.ValueInCents;
                    var quantityValue = quantity * cd.ValueInCents;

                    outputItems.Add(string.Format("{0} {1}", quantity, quantity > 1 ? cd.PluralName : cd.SingularName));
                    changeInCents = changeInCents - quantityValue;
                }
            }
            return string.Join(", ", outputItems);
        }
    }
}
