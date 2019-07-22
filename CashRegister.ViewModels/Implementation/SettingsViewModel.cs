using System.Collections.Generic;
using CashRegister.ViewModels.Interfaces;
using GalaSoft.MvvmLight;

namespace CashRegister.ViewModels.Implementation
{
    public class SettingsViewModel : ViewModelBase, ISettingsViewModel
    {
        private IEnumerable<string> _languages;
        public IEnumerable<string> Languages
        {
            get => _languages;
            set => Set(ref _languages, value);
        }
    }
}
