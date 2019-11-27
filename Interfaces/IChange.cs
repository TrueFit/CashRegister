using System.Collections.Generic;

namespace Interfaces
{
    public interface IChange
    {
        List<(int Number, IDenomination Money)> ChangeList { get; set; }
        int TotalCoins { get; }
        int TotalValue { get;}
    }
}
