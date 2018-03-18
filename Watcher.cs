using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CashRegister {
    public class Watcher {
    // Folder path variable to watch folder location
        private static string pFolderPath = @"C:\tmp\";
        public static string folderpath {
            get { return pFolderPath; }
            set { if (!string.IsNullOrWhiteSpace(value)) pFolderPath = value; }
        }
        private static List<string> doclist = new List<string>();
        static Random _r = new Random();
        private static Logger l = new Logger();
        public static void Main() {
            Run();
        }
        //[PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
        public static void Run() {
            string[] args = System.Environment.GetCommandLineArgs();
            if (args.Length > 1) {
                string argpath = args[1];
                if (argpath.Length > 1 && Directory.Exists(argpath))
                    folderpath = argpath;
            }
            if (Directory.Exists(pFolderPath)) {
                // Create a new FileSystemWatcher and set its properties.
                try {
                    FileSystemWatcher watcher = new FileSystemWatcher();
                    watcher.Path = pFolderPath;
                    // Only watch text files after writen to folder
                    watcher.NotifyFilter = NotifyFilters.LastWrite;
                    watcher.Filter = "*.txt";
                    watcher.Changed += new FileSystemEventHandler(OnChangedAsync);
                    watcher.EnableRaisingEvents = true;
                } catch (Exception e) {
                    l.Output("Error with FileSystemWatcher", e, System.Reflection.MethodBase.GetCurrentMethod().Name);
                } 
                // Wait for the user to quit the program.
                Console.WriteLine("Press \'q\' to quit the sample.");
                while (Console.Read() != 'q') ;
            } else
                Console.WriteLine("Folderpath '{0}' does not exist.", pFolderPath);
        }
        // Define the event handlers.
        private static async void OnChangedAsync(object source, FileSystemEventArgs ev) {

            // Specify what is done when a file is changed, created, or deleted.
            try {
                DateTime lastWriteTime = File.GetLastWriteTime(ev.FullPath);
                if (!doclist.Contains(ev.FullPath + "_" + lastWriteTime)) {
                    doclist.Add(ev.FullPath + "_" + lastWriteTime);
                    l.Output(String.Format("File:{0} {1} - {2}", ev.FullPath, ev.ChangeType, ev.Name));
                    await Task.Delay(1000);
                    await Task.Run(() => ProcessFile(ev.FullPath));
                }
            } catch (Exception e) {
                l.Output("Error with FileSystemEventArgs", e, System.Reflection.MethodBase.GetCurrentMethod().Name);
            }
        }
        private static async void ProcessFile(string file) {
            try {
                List<string> lines = await Task.Run(() => HandleFile(file)); 
                int t = lines.Count;
                int count = 0;
                l.Output(String.Format("Lines in file:{0}", t));
                foreach(string m in lines){
                    if (m.Contains(",")) {
                        string[] arr = m.Split(',');
                        if (arr.Length == 2 && !string.IsNullOrWhiteSpace(arr[0]) && !string.IsNullOrWhiteSpace(arr[1])) {
                            decimal ttl, given;
                            decimal.TryParse(arr[0], out ttl);
                            decimal.TryParse(arr[1], out given);
                            if(given>ttl){
                                decimal chng = given - ttl;
                                decimal dollars = Math.Truncate(chng);
                                chng = chng - dollars;
                                decimal outofCoin = 0.5m;
                                if ((ttl*100) % 3 == 0) {
                                    // always between 1, 2, or 3
                                    int rnd = _r.Next(1, 4);
                                    if (rnd == 3)
                                        rnd = 5;
                                    outofCoin = 0.05m * rnd;
                                }
                                string fmt = Change.GetListOfChange(chng, outofCoin);
                                l.Output(string.Format("{0} {1}",(dollars>0?(dollars+" dollar"+(dollars==1?"":"s")):""),fmt));
                            } else {
                                decimal chng =  ttl - given;
                                if (chng == 0)
                                    l.Output("No change needed");
                                else
                                    l.Output(string.Format("Still need {0}",chng));
                            }
                        } else {
                            throw new Exception(string.Format("Format not correct in file {1} at line {0}", count, file));
                        }
                    } else {
                        throw new Exception(string.Format("Expected comma in file {1} at line {0}", count, file));
                    }
                }
            } catch (Exception e) {
                l.Output("Unable ot perform Calculation", e, System.Reflection.MethodBase.GetCurrentMethod().Name);
            }
        }
        static List<string> HandleFile(string file = null) {
            int count = 0;
            List<string> lines = new List<string>();
            try {
                if (!string.IsNullOrWhiteSpace(file) && System.IO.File.Exists(file)) {
                    // Read in the specified file.
                    using (StreamReader reader = new StreamReader(file)) {
                        string line;
                        while ((line = reader.ReadLine()) != null) {
                            if (!string.IsNullOrWhiteSpace(line)) {
                                lines.Add(line);
                                count++;
                            }
                        }
                        reader.Close();
                        reader.Dispose();
                    }
                }
            } catch (Exception e) {
                l.Output(string.Format("Unable to retrieve data in file {1} at line {0}",count,file), e, System.Reflection.MethodBase.GetCurrentMethod().Name);
            }
            return lines;
        }
    }
}
