using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Input;
using CashRegister.Model;
using CashRegister.Model.Interfaces;
using CashRegister.ViewModels.Interfaces;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;

namespace CashRegister.ViewModels.Implementation
{
    public class MainViewModel : ViewModelBase, IMainViewModel
    {
        private readonly IFileAccess _fileAccess;
        private readonly IChangeGenerationService _service;
        private readonly ISettingsViewModel _settingsViewModel;

        private readonly StringBuilder _normalizerBuilder;

        public MainViewModel(IFileAccess fileAccess, IChangeGenerationService service,
            ISettingsViewModel settingsViewModel)
        {
            _fileAccess = fileAccess;
            _service = service;
            _settingsViewModel = settingsViewModel;

            _normalizerBuilder = new StringBuilder();
        }

        #region IMainViewModel implementation

        public event OnSelectingFileDelegate OnSelectingFile;

        public ICommand BrowseCommand
        {
            get => new RelayCommand(ReadFile);
        }

        public ICommand GenerateChangeCommand
        {
            get => new RelayCommand(GenerateChangeForAllEntries);
        }


        private string _inputFilePath;
        public string InputFilePath
        {
            get => _inputFilePath;
            set => Set(ref _inputFilePath, value);
        }

        private string _inputFileContentText;
        public string InputFileContentText
        {
            get => _inputFileContentText;
            set
            {
                string normalizedValue = NormalizeInputText(value);
                CanGenerateChange = IsInputTextValid(normalizedValue);

                Set(ref _inputFileContentText, value);
            }
        }

        private string _outputText;
        public string OutputText
        {
            get => _outputText;
            set => Set(ref _outputText, value);
        }

        private bool _canGenerateChange;
        public bool CanGenerateChange
        {
            get => _canGenerateChange;
            set => Set(ref _canGenerateChange, value);
        }

        public void SetUpdateDivisorOnStartupEvent(UpdateDivisorOnStartupDelegate del)
        {
            _settingsViewModel.UpdateDivisorOnStartup += del;
        }

        #endregion

        #region Private Methods
        
        private void ReadFile()
        {
            if (OnSelectingFile is null) return;

            InputFilePath = OnSelectingFile.Invoke();
            InputFileContentText = _fileAccess.ReadFileContents(InputFilePath);
        }

        private void GenerateChangeForAllEntries()
        {
            if (!CanGenerateChange) return;

            OutputText = string.Empty;

            // parse each entry from the InputText
            IEnumerable<Tuple<double, double>> parsedInputs = ParseInputs(InputFileContentText);

            // generate change for each individual entry
            var builder = new StringBuilder();

            foreach ((double amountOwed, double amountPaid) in parsedInputs)
            {
                ISettings settings = ModelContainer.Settings;

                settings.DivisorForRandomChange = _settingsViewModel.DivisorForRandomChange;
                settings.AmountOwed = amountOwed;
                settings.AmountPaid = amountPaid;

                builder.Append($"{_service.GenerateChange(settings)}\r\n");
            }
            
            OutputText = builder.ToString();
        }

        private IEnumerable<Tuple<double, double>> ParseInputs(string inputText)
        {
            var parsedInputs = new List<Tuple<double, double>>();
            if (!IsInputTextValid(NormalizeInputText(inputText)))
                return parsedInputs;

            string[] amountPairs = inputText.Split(new []{ "\r\n" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (string amountPair in amountPairs)
            {
                string[] pairs = amountPair.Split(',');
                double amountOwed = double.Parse(pairs.First());
                double amountPaid = double.Parse(pairs.Last());

                parsedInputs.Add(new Tuple<double, double>(amountOwed, amountPaid));
            }

            return parsedInputs;
        }


        /// <summary>
        /// If the inputText does not end with a new line sequence, this will append it.
        /// </summary>
        /// <param name="inputText"></param>
        /// <returns></returns>
        private string NormalizeInputText(string inputText)
        {
            const string CARRIAGE_RETURN_LINE_FEED = "\r\n";

            _normalizerBuilder.Clear();
            _normalizerBuilder.Append(inputText);
            
            if (!_normalizerBuilder.ToString()
                                   .EndsWith(CARRIAGE_RETURN_LINE_FEED))
                _normalizerBuilder.Append(CARRIAGE_RETURN_LINE_FEED);

            return _normalizerBuilder.ToString();
        }

        private bool IsInputTextValid(string inputText)
        {
            return Regex.IsMatch(inputText, @"^(\s*[0-9]*\.[0-9]{2}\s*,\s*[0-9]*\.[0-9]{2}\s*\r\n)*$");
        }

        #endregion
    }
}
