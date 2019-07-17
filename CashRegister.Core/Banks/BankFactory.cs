using CashRegister.Interfaces.Banks;

namespace CashRegister.Core.Banks
{
    /// <summary>
    /// Abstract BankFactory
    /// </summary>
    public abstract class BankFactory
    {
        public BankFactory() { }

        public abstract IBank Create();
    }
}
