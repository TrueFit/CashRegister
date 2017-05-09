using System;
using CashRegister.Services.Contracts;
using System.IO;

namespace CashRegister.Services
{
    public class OutputFileService : IOutputFileService
    {
        private readonly string _outputPath;
        public OutputFileService(string outputPath)
        {
            _outputPath = outputPath;
        }

        public void ProcessOutputFile()
        {
            if (File.Exists(_outputPath))
                File.Delete(_outputPath);
        }

        public void WriteLine(string text)
        {
            using (var sw = new StreamWriter(_outputPath, true))
            {
                sw.WriteLine(text);
            }
        }
    }
}
