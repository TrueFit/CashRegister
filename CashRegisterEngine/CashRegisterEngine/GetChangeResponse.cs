using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CashRegisterEngine
{
    public class GetChangeResponse
    {
        public decimal amtOwed { get; set; } 

        public decimal amtPaid { get; set; }

        public decimal amtChange { get; set; }

        public ICollection<CurrencyItem> currencyItems { get; set; }

        public GetChangeResponse()
        {
            this.currencyItems = new List<CurrencyItem>();
        }

        public override string ToString()
        {
            StringBuilder sbValue = new StringBuilder();

            int _itmIdx = 0;
            var _allCurrencyItems = new List<CurrencyItem>();
            _allCurrencyItems.AddRange(this.currencyItems.Where(i => i.currencyType == CurrencyType.paper).OrderByDescending(i => i.currencyValue));
            _allCurrencyItems.AddRange(this.currencyItems.Where(i => i.currencyType == CurrencyType.coin).OrderByDescending(i => i.currencyValue));

            foreach(var itm in _allCurrencyItems)
            {
                sbValue.Append(itm.ToString());
                _itmIdx++;
                if (_itmIdx > 0 && _itmIdx < _allCurrencyItems.Count)
                {
                    sbValue.Append(", ");
                }
            }

            return sbValue.ToString();
        }
    }
}
