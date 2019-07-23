using System.IO;
using System.Windows.Input;

namespace CashRegister.ViewModels.Interfaces
{
    public interface IMainViewModel
    {
        string InputFilePath { get; set; }
        ICommand LoadFileCommand { get; }
        string InputText { get; }
    }
}
