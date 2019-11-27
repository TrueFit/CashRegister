
using System.Collections.Generic;


namespace Interfaces
{
   public interface ICurrency
    {
        string Name { get; }
        string Format { get; }
        string Code { get; }
        string Symbol { get;  }
        int Multiplier { get; }
        List<IDenomination> Denominations { get; }
    }
}
