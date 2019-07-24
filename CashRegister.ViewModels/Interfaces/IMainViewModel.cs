using System.Windows.Input;

namespace CashRegister.ViewModels.Interfaces
{
    public delegate string OnSelectingFileDelegate();

    public interface IMainViewModel
    {
        event OnSelectingFileDelegate OnSelectingFile;

        ICommand BrowseCommand { get; }
        ICommand GenerateChangeCommand { get; }

        string InputFilePath { get; set; }
        string InputFileContentText { get; }
    }
}
