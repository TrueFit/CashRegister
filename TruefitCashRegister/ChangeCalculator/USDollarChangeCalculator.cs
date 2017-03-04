using ModelObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChangeCalculator
{
    public class USDollarChangeCalculator : ICalculator
    {
        private ICurrency currencyStructure;
        private Random rand;

        public USDollarChangeCalculator()
        {
            currencyStructure = new USCurrencyStructure();
            rand = new Random();
        }

        public ChangeSummary GetChange(decimal cost, decimal received)
        {
            ChangeSummary summary = new ChangeSummary
            {
                Price = cost,
                ReceivedMoney = received
            };

            if (received < cost)
                summary.ChangeItems = new List<ChangeItem> { new ChangeItem { Count = 1, Currency = new Denomination { Name = "Insufficient Payment" } } };
            else if (cost == received)
                summary.ChangeItems = new List<ChangeItem>();
            else if (cost % 0.03M == 0)
                summary.ChangeItems = RandomChange(received - cost).ToList();
            else
                summary.ChangeItems = MinimumItemCountChange(received - cost).ToList();

            PluralizeDenominationNames(summary.ChangeItems);
            return summary;
        }

        private IEnumerable<ChangeItem> RandomChange(decimal changeDue)
        {
            List<ChangeItem> changeList = new List<ChangeItem>();

            foreach (var currency in currencyStructure.GetCurrencyItems().OrderByDescending(i => i.Value))
            {
                if(currency.Value > 0.01M)
                {
                    int count = (int)(changeDue / currency.Value);
                    int use = rand.Next(0, count + 1);
                    if (use > 0)
                    {
                        changeList.Add(new ChangeItem
                        {
                            Count = use,
                            Currency = currency
                        });
                        changeDue -= use * currency.Value;
                    }
                }
                else if (currency.Value == 0.01M)
                {
                    changeList.Add(new ChangeItem
                    {
                        Count = (int)(changeDue / currency.Value),
                        Currency = currency
                    });
                    changeDue -= (int)(changeDue / currency.Value) * currency.Value;
                }
            }

            return changeList;
        }

        private IEnumerable<ChangeItem> MinimumItemCountChange(decimal changeDue)
        {
            List<ChangeItem> changeList = new List<ChangeItem>();

            foreach(var currency in currencyStructure.GetCurrencyItems().OrderByDescending(i => i.Value))
            {
                int count = (int)(changeDue / currency.Value);
                if (count > 0)
                {
                    changeList.Add(new ChangeItem
                    {
                        Count = count,
                        Currency = currency
                    });
                    changeDue -= count * currency.Value;
                }
            }
            
            return changeList;
        }

        private void PluralizeDenominationNames(IEnumerable<ChangeItem> change)
        {
            foreach(var i in change)
            {
                if (i.Count > 1)
                    i.Currency.Name = i.Currency.Name[i.Currency.Name.Length - 1] == 'y' ? i.Currency.Name.Substring(0, i.Currency.Name.Length - 1) + "ies" : i.Currency.Name + "s";
            }
        }
    }
}
