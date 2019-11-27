using Interfaces;

namespace DomainModels.Denominations
{
    public class Dime : IDenomination
    {
        public string Name => "Dime";
        public string NamePlural => $"{Name}s";
        public int Value => 10;
    }
}
