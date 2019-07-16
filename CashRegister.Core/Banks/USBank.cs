using CashRegister.Core.Denominations;
using CashRegister.Core.Enums;
using CashRegister.Interfaces.Banks;
using CashRegister.Interfaces.Denominations;
using System.Collections.Generic;

namespace CashRegister.Core.Banks
{
    /// <summary>
    /// A singleton for US denominations
    /// </summary>
    public class USBank : IBank
    {
        private readonly Dictionary<USValues, IDenomination> denoms;

        private USBank()
        {
            denoms = new Dictionary<USValues, IDenomination>
            {
                { USValues.Dollar, new Dollar() },
                { USValues.Quarter, new Quarter() },
                { USValues.Dime, new Dime() },
                { USValues.Nickel, new Nickel() },
                { USValues.Penny, new Penny() }
            };
        }

        public static IBank Initialize() => new USBank();

        public IDenomination Retrieve(System.Enum val) => denoms[(USValues) val];
    }
}
