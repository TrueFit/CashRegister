using System.Windows.Input;
using CashRegister.Model.Interfaces;
using CashRegister.ViewModels.Interfaces;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;

namespace CashRegister.ViewModels.Implementation
{
    public class MainViewModel : ViewModelBase, IMainViewModel
    {
        private IFileAccess _fileAccess;

        public MainViewModel(IFileAccess fileAccess)
        {
            _fileAccess = fileAccess;
        }

        private string _inputPath;
        public string InputFilePath
        {
            get => _inputPath;
            set => Set(ref _inputPath, value);
        }

        public ICommand LoadFileCommand
        {
            get { return new RelayCommand(() => ReadFile(InputFilePath)); }
        }

        private string _inputFileContentText;
        public string InputFileContentText
        {
            get => _inputFileContentText;
            set => Set(ref _inputFileContentText, value);
        }

        private void ReadFile(string inputFilePath)
        {
            InputFileContentText = _fileAccess.ReadFileContents(inputFilePath);
        }
    }
}
