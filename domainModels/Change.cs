using System.Collections.Generic;
using System.Linq;
using Interfaces;

namespace DomainModels
{
    public class Change : IChange
    {
        public List<(int Number, IDenomination Money)> ChangeList{get;set;}
       
        public int TotalCoins =>ChangeList.Sum(c => c.Number);
        public int TotalValue => ChangeList.Sum(c => c.Number *c.Money.Value);

        public Change()
        {
            ChangeList = new List<(int Number, IDenomination Money)>();
        }
    }
}
