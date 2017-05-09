using System.IO;

namespace CashRegister.Services.Contracts
{
    public interface IInputFileService
    {
        void ProcessLocalInputFile(string inputPath, IOutputFileService outputFileService);
        void ProcessStreamReader(StreamReader sr, IOutputFileService outputFileService);
    }
}