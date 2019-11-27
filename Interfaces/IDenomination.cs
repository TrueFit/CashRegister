using System;


namespace Interfaces
{
    public interface IDenomination 
    {
        string Name { get; }
        string NamePlural { get; }
        int Value { get;  }
    }
}
