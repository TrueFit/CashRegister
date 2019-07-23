using System.IO;
using System.Text;
using System.Windows.Input;
using CashRegister.ViewModels.Interfaces;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;

namespace CashRegister.ViewModels.Implementation
{
    public class MainViewModel : ViewModelBase, IMainViewModel
    {
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

        private StringBuilder _inputTextBuilder = new StringBuilder();
        public string InputText => _inputTextBuilder.ToString();

        private void ReadFile(string inputFilePath)
        {
            // TODO: implement and set the InputText via _inputTextBuilder       
        }
    }
}
