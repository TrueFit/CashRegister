using Interfaces;

namespace DomainModels.Denominations
{
    public class Dollar : IDenomination
    {
        public string Name  => "Dollar"; 
        public string NamePlural => $"{Name}s";
        public int Value => 100; 

       
    }
}
