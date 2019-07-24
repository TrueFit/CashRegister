using System.Windows;
using CashRegister.Properties;
using CashRegister.ViewModels.Interfaces;
using Microsoft.Win32;

namespace CashRegister
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            var viewModel = (IMainViewModel) DataContext;
            viewModel.OnSelectingFile += DisplayOpenFileDialog;
            viewModel.SetUpdateDivisorOnStartupEvent(() => Settings.Default.DivisorForRandomChange);
        }

        private void ExitMenuItem_OnClick(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void SettingsMenuItem_OnClick(object sender, RoutedEventArgs e)
        {
            ShowWindow(new SettingsWindow(), WindowStartupLocation.CenterOwner);
        }

        private void ShowWindow(Window window, WindowStartupLocation startupLocation)
        {
            window.Owner = this;
            window.WindowStartupLocation = startupLocation;
            window.Show();
        }

        private string DisplayOpenFileDialog()
        {
            var dialog = new OpenFileDialog
            {
                InitialDirectory = @"C:\",
                Filter = "Text Files (*.txt)|*.txt|All files (*.*)|*.*"
            };

            dialog.ShowDialog(this);

            return dialog.FileName;
        }
    }
}
