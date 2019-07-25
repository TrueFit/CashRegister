using CashRegister.Model.Interfaces;
using System;
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

            try
            {
                using (var reader = new StreamReader(filePath))
                {
                    builder.Append(reader.ReadToEnd());
                }
            }
            catch (Exception e)
            {
                // error handling can definitely be better here, but this will give a good idea for now.
                builder.Append(e.Message);
            }

            return builder.ToString();
        }
    }
}
