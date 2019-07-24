using System.Collections.Generic;

namespace CashRegister.ViewModels.Interfaces
{
    public delegate int UpdateDivisorOnStartupDelegate();
    public interface ISettingsViewModel
    {
        event UpdateDivisorOnStartupDelegate UpdateDivisorOnStartup;

        IEnumerable<string> Languages { get; }
        int DivisorForRandomChange { get; set; }
    }
}
