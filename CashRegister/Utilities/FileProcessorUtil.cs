using System;
using System.Collections.Generic;
using System.IO;

namespace CashRegister
{
    class FileProcessorUtil
    {
        private string filePath;
        private List<string> transactions;

        public string Change { get; set; }
        public List<string> Transactions
        {
            get
            {
                return transactions;
            }
        }

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
            catch(Exception ex)
            {
                string errorLogPath = AppDomain.CurrentDomain.BaseDirectory +
                    "ErrorLog " + DateTime.Now.Date.Month + "-" +
                    DateTime.Now.Date.Day + "-" + DateTime.Now.Date.Year + " " +
                    DateTime.Now.TimeOfDay.Hours + "H" + DateTime.Now.TimeOfDay.Minutes + "M" + ".txt";
                ErrorLog log = new ErrorLog(errorLogPath);
                log.WriteError(ex.Message);
            }
        }

        /// <summary>
        /// Writes output to file.
        /// </summary>
        /// <param name="path"></param>
        internal void WriteToFile(string path)
        {
            path = Path.GetFullPath(path);

            try
            {
                using (StreamWriter sw = new StreamWriter(path))
                {
                    sw.Write(Change);
                }                
            }
            catch(Exception ex)
            {
                string errorLogPath = AppDomain.CurrentDomain.BaseDirectory +
                    "ErrorLog " + DateTime.Now.Date.Month + "-" +
                    DateTime.Now.Date.Day + "-" + DateTime.Now.Date.Year + " " +
                    DateTime.Now.TimeOfDay.Hours + "H" + DateTime.Now.TimeOfDay.Minutes + "M" + ".txt";
                ErrorLog log = new ErrorLog(errorLogPath);
                log.WriteError(ex.Message);
            }
        }
    }
}
