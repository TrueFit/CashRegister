using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    class FileProcessorUtil
    {
        private string filePath;
        private List<string> transactions;

        public List<string> Transactions
        {
            get
            {
                return transactions;
            }
        }

        public String Change { get; set; }
        

        public FileProcessorUtil(string path)
        {
            transactions = new List<string>();
            this.filePath = Path.GetFullPath(path);
            ReadFile(path);
        }

        /// <summary>
        /// Gets the transactions from the input file.
        /// </summary>
        /// <param name="path">Path describing location of the input file.</param>
        private void ReadFile(string path )
        {
            try
            {
                using (FileStream fs = File.Open(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                using (BufferedStream bs = new BufferedStream(fs))
                using (StreamReader sr = new StreamReader(bs))
                {
                    string line;
                    while((line = sr.ReadLine()) != null)
                    {
                        if(!string.IsNullOrEmpty(line))
                        {
                            line = line.Trim();
                            transactions.Add(line);     
                        }
                    }
                }
            }
            catch(FileNotFoundException Ex)
            {
                Console.WriteLine("File Not Found{0}. {1}", Environment.NewLine, Ex.Message);                
            }
            catch(Exception Ex)
            {
                Console.WriteLine(Ex.Message);
            }
        }
    }
}
