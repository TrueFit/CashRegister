using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegister.ViewModels.Interfaces
{
    public interface ISettingsViewModel
    {
        IEnumerable<string> Languages { get; }
    }
}
