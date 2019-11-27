using Interfaces;

namespace DomainModels.Denominations
{
    public  class Nickel : IDenomination
    {
        public string Name =>"Nickel";
        public string NamePlural => $"{Name}s";
        public int Value => 5;
    }
}
