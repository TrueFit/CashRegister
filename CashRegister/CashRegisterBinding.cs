using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ninject;
using Ninject.Modules;
using Ninject.Planning.Bindings;

namespace CashRegister
{
    public class CashRegisterBinding : NinjectModule
    {
        public override void Load()
        {
            Bind<ICashRegister>().To<CashRegister>().InSingletonScope();
        }
    }
}
