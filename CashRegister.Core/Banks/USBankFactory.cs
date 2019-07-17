using CashRegister.Interfaces.Banks;

namespace CashRegister.Core.Banks
{
    /// <summary>
    /// Factory for Bank containing US Denominations
    /// </summary>
    public class USBankFactory : BankFactory
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public USBankFactory() : base() { }

        /// <summary>
        /// Create USBank
        /// </summary>
        /// <returns>USBank</returns>
        public override IBank Create() => USBank.Initialize();
    }
}
