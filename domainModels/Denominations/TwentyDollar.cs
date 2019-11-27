using Interfaces;

namespace DomainModels.Denominations
{
    public class TwentyDollar :  IDenomination
    {
        public string Name => "20 Dollar Bill";
        public string NamePlural => $"{Name}s";
        public int Value => 2000;
    }
}
