using System.Collections.Generic;
using CashRegister.ViewModels.Interfaces;
using GalaSoft.MvvmLight;

namespace CashRegister.ViewModels.Implementation
{
    public class SettingsViewModel : ViewModelBase, ISettingsViewModel
    {
        private IEnumerable<string> _languages;

        public event UpdateDivisorOnStartupDelegate UpdateDivisorOnStartup;

        public IEnumerable<string> Languages
        {
            get => _languages;
            set => Set(ref _languages, value);
        }

        private int _divisorForRandomChange = default(int);
        public int DivisorForRandomChange
        {
            get
            {
                if (_divisorForRandomChange != default(int)) return _divisorForRandomChange;

                if (UpdateDivisorOnStartup is null) return _divisorForRandomChange;

                _divisorForRandomChange = UpdateDivisorOnStartup.Invoke();
                return _divisorForRandomChange;
            }
            set { Set(ref _divisorForRandomChange, value); }
        }
    }
}
