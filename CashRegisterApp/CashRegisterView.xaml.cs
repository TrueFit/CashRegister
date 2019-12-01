using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Windows;
using System.Windows.Controls;

namespace CashRegisterApp
{
    /// <summary> Interaction logic for CashRegisterView.xaml </summary>
    public partial class MainWindow : Window
    {
        #region Private Fields

        /// <summary> ViewModel that is bound to the UI's DataContext. </summary>
        private readonly CashRegisterViewModel _vm = new CashRegisterViewModel();

        #endregion Private Fields

        #region Public Constructors

        /// <summary> Initializes the UI and sets up default values. </summary>
        public MainWindow()
        {
            InitializeComponent();
            DataContext = _vm;
            cbx_Locale.ItemsSource = Enum.GetValues(typeof(Locales));
            cbx_Locale.SelectedIndex = 0;
            _vm.Locale = cbx_Locale.SelectedItem.ToString();
        }

        #endregion Public Constructors

        #region Private Methods

        /// <summary> Clear out the UI to allow for a rerun or a new file to be read in. </summary>
        /// <param name="sender"> </param>
        /// <param name="e"> </param>
        private void btn_clear_Click(object sender, RoutedEventArgs e)
        {
            _vm.Output = new ObservableCollection<string>();
            _vm.CashRegister.Input = new List<Transaction>();
            _vm.CashRegister.Output = new ObservableCollection<string>();
        }

        /// <summary> Close the application </summary>
        /// <param name="sender"> </param>
        /// <param name="e"> </param>
        private void btn_exit_Click(object sender, RoutedEventArgs e) => Application.Current.Shutdown();

        /// <summary> Read the typed file or open a dialog to navigate for a file. </summary>
        /// <param name="sender"> </param>
        /// <param name="e"> </param>
        private void btn_load_Click(object sender, RoutedEventArgs e)
        {
            string filepath = txt_input.Text;

            // Open a file browse dialog if there isn't already a loaded file.
            if (string.IsNullOrEmpty(_vm.InputFile) || string.IsNullOrEmpty(filepath))
            {
                OpenFileDialog fileDialog = new OpenFileDialog()
                {
                    Filter = "Comma Seperated(*.csv)|*.csv"
                };

                fileDialog.InitialDirectory = Environment.CurrentDirectory;
                bool? result = fileDialog.ShowDialog();

                if (result.HasValue && result.Value)
                {
                    filepath = fileDialog.FileName;
                }
            }

            if (File.Exists(filepath))
            {
                _vm.InputFile = filepath;
            }
            else
            {
                MessageBox.Show("Please submit a valid input file.");
            }
        }

        /// <summary> Process the given input and calculate. </summary>
        /// <param name="sender"> </param>
        /// <param name="e"> </param>
        private void btn_run_Click(object sender, RoutedEventArgs e)
        {
            _vm.CashRegister.ParseInput();
            _vm.CalculateChange();
        }

        /// <summary> Change the locale to be used for processing. </summary>
        /// <param name="sender"> </param>
        /// <param name="e"> </param>
        private void cbx_Locale_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            _vm.Locale = cbx_Locale.SelectedItem.ToString();
        }

        #endregion Private Methods
    }
}