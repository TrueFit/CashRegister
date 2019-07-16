using CashRegister.Core.Banks;
using CashRegister.Interfaces.Banks;
using CashRegister.Interfaces.Tills;

namespace CashRegister.Core.Tills
{
    public class USTillFactory : TillFactory
    {
        public USTillFactory(IBank b) : base(b) { }

        public override ITill Create(bool randomize) => new USTill((USBank) bank, randomize);
    }
}
