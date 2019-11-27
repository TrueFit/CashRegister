using Interfaces;

namespace DomainModels.Denominations
{
    public class Quarter :  IDenomination
    {
        public string Name => "Quarter";
        public string NamePlural => $"{Name}s";
        public int Value => 25;
    }
}
