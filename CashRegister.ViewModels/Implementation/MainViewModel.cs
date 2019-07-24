using System.Windows.Input;
using CashRegister.Model.Interfaces;
using CashRegister.ViewModels.Interfaces;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;

namespace CashRegister.ViewModels.Implementation
{
    public class MainViewModel : ViewModelBase, IMainViewModel
    {
        private readonly IFileAccess _fileAccess;

        public MainViewModel(IFileAccess fileAccess)
        {
            _fileAccess = fileAccess;
        }

        #region IMainViewModel implementation

        public event OnSelectingFileDelegate OnSelectingFile;

        public ICommand BrowseCommand
        {
            get => new RelayCommand(Browse);
        }

        public ICommand GenerateChangeCommand
        {
            get => new RelayCommand(GenerateChange);
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
            set => Set(ref _inputFileContentText, value);
        }

        #endregion

        #region Private Methods

        private void ReadFile(string inputFilePath)
        {
            InputFileContentText = _fileAccess.ReadFileContents(inputFilePath);
        }

        private void Browse()
        {
            InputFilePath = OnSelectingFile?.Invoke();
            ReadFile(InputFilePath);
        }

        private void GenerateChange()
        {

        }

        #endregion
    }
}
