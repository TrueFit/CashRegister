using CashRegister.Core.Banks;
using CashRegister.Interfaces.Banks;
using CashRegister.Interfaces.Tills;

namespace CashRegister.Core.Tills
{
    /// <summary>
    /// Factory for Till containing US Denominations
    /// </summary>
    public class USTillFactory : TillFactory
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="b">A Bank</param>
        public USTillFactory(IBank b) : base(b) { }

        /// <summary>
        /// Create USTill
        /// </summary>
        /// <param name="randomize">An optional argument signifying if the denomination order should be randomized</param>
        /// <returns>USTill</returns>
        public override ITill Create(bool randomize) => new USTill((USBank) bank, randomize);
    }
}
