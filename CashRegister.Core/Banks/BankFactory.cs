using CashRegister.Interfaces.Banks;

namespace CashRegister.Core.Banks
{
    public abstract class BankFactory
    {
        public BankFactory() { }

        public abstract IBank Create();
    }
}
