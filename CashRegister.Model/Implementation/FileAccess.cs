using CashRegister.Model.Interfaces;
using System.IO;
using System.Text;

namespace CashRegister.Model.Implementation
{
    public class FileAccess : IFileAccess
    {
        // TODO: needs an integration test        
        public string ReadFileContents(string filePath)
        {
            if (!File.Exists(filePath)) throw new FileNotFoundException();

            StringBuilder builder = new StringBuilder();

            using (var reader = new StreamReader(filePath))
            {
                builder.Append(reader.ReadToEnd());
            }

            return builder.ToString();
        }
    }
}
