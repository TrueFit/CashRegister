using System.ComponentModel;
using System.Windows;
using CashRegister.Properties;

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
        }

        private void SettingsWindow_OnClosing(object sender, CancelEventArgs e)
        {
            Settings.Default.Save();
        }
    }
}
