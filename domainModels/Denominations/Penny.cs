using Interfaces;

namespace DomainModels.Denominations
{
    public class Penny : IDenomination
    {
        public string Name => "Penny";
        public string NamePlural => "Pennies";
        public int Value => 1;
    }
}
