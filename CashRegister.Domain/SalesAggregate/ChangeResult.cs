using System;
using System.Collections.Generic;
using System.Linq;

namespace CashRegister.Domain.SalesAggregate
{
    public class ChangeResult
    {
        public ChangeResult(Dictionary<Denomination, int> changeDue)
        {
            ChangeDue = changeDue;
        }

        public Dictionary<Denomination, int> ChangeDue { get; private set; }

        public string ChangeDueFormatted
        {
            get
            {
                return String.Join(" , ",
                    ChangeDue.Select(x => $"{x.Value} {(x.Value > 1 ? x.Key.NamePlural : x.Key.NameSingular)}"));
            }
        }
    }
}
