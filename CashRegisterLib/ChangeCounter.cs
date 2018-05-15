using System;
using System.Collections;
using System.Collections.Generic;

namespace CashRegisterLib
{
    public class ChangeCounter
    {
        private readonly SortedList<CashDenomination, int> _changeDue;
        private const string NoChange = "No change due";

        public ChangeCounter()
        {
            _changeDue = new SortedList<CashDenomination, int>();
        }

        public void AddChange(CashDenomination denomination, int qty)
        {
            if(denomination == null)
            {
                throw new ArgumentNullException(nameof(denomination));
            }

            if(qty == 0) {
                return;
            }

            if (_changeDue.ContainsKey(denomination))
            {
                _changeDue[denomination] += qty;
            }
            else
            {
                _changeDue.Add(denomination, qty);
            }
        }

        public void AddChange(CashDenomination denomination) {
            AddChange(denomination, 1);
        }

        private string GetChangeInstruction()
        {
            ArrayList units = new ArrayList();

            foreach (var c in _changeDue)        
            {
                units.Add($"{c.Value} {(c.Value == 1 ? c.Key.SingularName : c.Key.PluralName)}");
            }

            return units.Count > 0 ? string.Join(", ", units.ToArray()) : NoChange;
        }

        public override string ToString()
        {
            return GetChangeInstruction();
        }
    }
}
