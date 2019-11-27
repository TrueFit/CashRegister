using Interfaces;

namespace DomainModels.Denominations
{
    public class OneHundredDollar : IDenomination
    {
        public string Name => "100 Dollar Bill";
        public string NamePlural => $"{Name}s";
        public int Value => 10000;
    }
}
