using System;
using System.IO;
using System.Windows;
using Microsoft.Win32;

namespace CashRegister
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private string _outputFilePath;

        public MainWindow()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 'Browse' button handler. Opens OpenFileDialog and accepts input file and displays path to file in textbox.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnBrowse_Click(object sender, RoutedEventArgs e)
        {
            var openFileDialog = new OpenFileDialog
            {
                Filter = "Text files (*.txt)|*.txt|CSV files (*.csv)|*.csv|All files (*.*)|*.*",
                CheckPathExists = true,
                CheckFileExists = true
            };

            if (openFileDialog.ShowDialog() == true)
            {
                txtFilePath.Text = openFileDialog.FileName;
                _outputFilePath = $"{Path.GetDirectoryName(openFileDialog.FileName)}\\CashRegisterOutput.txt";
            }
        }

        /// <summary>
        /// 'Process' button handler. Opens streams to read input, process the line, and write the output.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnProcess_Click(object sender, RoutedEventArgs e)
        {
            WriteToTextboxLog($"Starting processing file: {txtFilePath.Text}");

            var cashRegister = new Core.CashRegister();

            try
            {
                using (var writer = new StreamWriter(_outputFilePath))
                {
                    using (var reader = new StreamReader(txtFilePath.Text))
                    {
                        while (!reader.EndOfStream)
                        {
                            try
                            {
                                writer.WriteLine(cashRegister.ProcessChange(reader.ReadLine()));
                            }
                            catch (ArgumentException ex)
                            {
                                writer.WriteLine(ex.Message);
                                WriteToTextboxLog($"{ex.GetType().Name}: {ex.Message}");
                            }
                        }
                    }
                }
            }
            catch (IOException ex)
            {
                WriteToTextboxLog($"{ex.GetType().Name}: {ex.Message}");
            }

            WriteToTextboxLog($"Finished Processing.  Output saved at: {_outputFilePath}");
        }

        /// <summary>
        /// Appends the supplied message to the logging textbox on its own line.
        /// </summary>
        /// <param name="message"></param>
        private void WriteToTextboxLog(string message)
        {
            txtLog.Text += $"{message}\r\n";
        }
    }
}
