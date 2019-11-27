using Interfaces;

namespace DomainModels.Denominations
{
    public class TenDollar : IDenomination
    {
        public string Name => "10 Dollar Bill";
        public string NamePlural => $"{Name}s";
        public int Value => 1000;
    }
}
