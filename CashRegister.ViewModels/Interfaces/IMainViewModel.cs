using System.Windows.Input;

namespace CashRegister.ViewModels.Interfaces
{
    public delegate string OnSelectingFileDelegate();

    public interface IMainViewModel
    {
        event OnSelectingFileDelegate OnSelectingFile;

        ICommand LoadFileCommand { get; }
        ICommand BrowseCommand { get; }

        string InputFilePath { get; set; }
        string InputFileContentText { get; }
    }
}
