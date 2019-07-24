using System.ComponentModel;
using System.Windows;
using CashRegister.Properties;
using CashRegister.ViewModels.Implementation;

namespace CashRegister
{
    /// <summary>
    /// Interaction logic for SettingsWindow.xaml
    /// </summary>
    public partial class SettingsWindow : Window
    {
        public SettingsWindow()
        {
            InitializeComponent();
            UpdateSettingsViewModelData();
        }

        private void SettingsWindow_OnClosing(object sender, CancelEventArgs e)
        {
            Settings.Default.Save();

            UpdateSettingsViewModelData();
        }

        private void UpdateSettingsViewModelData()
        {
            ((SettingsViewModel)DataContext).DivisorForRandomChange
                = Settings.Default.DivisorForRandomChange;
        }
    }
}
