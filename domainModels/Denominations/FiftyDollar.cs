using Interfaces;

namespace DomainModels.Denominations
{
    public class FiftyDollar : IDenomination
    {
        public string Name => "50 Dollar Bill";
        public string NamePlural => $"{Name}s";
        public int Value => 5000;
           
    }
}
