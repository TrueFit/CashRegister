namespace CashRegister.Model.Interfaces
{
    public interface IFileAccess
    {
        string ReadFileContents(string filePath);
    }
}
