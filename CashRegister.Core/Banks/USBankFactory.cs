using CashRegister.Interfaces.Banks;

namespace CashRegister.Core.Banks
{
    public class USBankFactory : BankFactory
    {
        public USBankFactory() : base() { }

        public override IBank Create() => USBank.Initialize();
    }
}
