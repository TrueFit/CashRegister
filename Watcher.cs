using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CashRegister {
    public class Watcher {
        // Folder path variable to watch folder location
        private static string pFolderPath = @"C:\tmp\";
        private static string outPutFolderPath = pFolderPath + @"OutPut\";
        private static string processFolderPath = pFolderPath + @"Processed\";
        private static string errorFolderPath = pFolderPath + @"Errors\";
        
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
                    watcher.NotifyFilter = NotifyFilters.FileName;
                    watcher.IncludeSubdirectories = false;
                    watcher.Filter = "*.txt";
                    watcher.Created += new FileSystemEventHandler(OnChangedAsync);
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
        private static void OnChangedAsync(object source, FileSystemEventArgs ev) {

            // Specify what is done when a file is changed, created, or deleted.
            try {
                if (!Regex.IsMatch(ev.Name, @"_cmpl\.txt", RegexOptions.IgnoreCase)) {
                    DateTime lastWriteTime = File.GetLastWriteTime(ev.FullPath);
                    // check if already processing - filewatcher sometimes triggers twice!!
                    if (!doclist.Contains(ev.FullPath + "_" + lastWriteTime)) {
                        doclist.Add(ev.FullPath + "_" + lastWriteTime);
                        l.Output(String.Format("File:{0} {1} - {2}", ev.FullPath, ev.ChangeType, ev.Name));
                        ProcessFile(ev.FullPath);
                        MoveFile(ev.FullPath, ev.Name, processFolderPath);
                    }
                } else {
                    l.Output(string.Format("Skipping {0}, if needed, please remove '_cmpl' in file name",ev.Name));
                }
            } catch (Exception e) {
                l.Output("Error with FileSystemEventArgs", e, System.Reflection.MethodBase.GetCurrentMethod().Name);
                MoveFile(ev.FullPath, ev.Name, errorFolderPath);
            }
        }
        private static void ProcessFile(string file) {
            List<string> lines = HandleFile(file);
            List<string> writeOut = new List<string>();
            int t = lines.Count;
            int count = 0;
            l.Output(String.Format("Lines in file:{0}", t));
            foreach (string m in lines) {
                if (m.Contains(",")) {
                    string[] arr = m.Split(',');
                    if (arr.Length == 2 && !string.IsNullOrWhiteSpace(arr[0]) && !string.IsNullOrWhiteSpace(arr[1])) {
                        decimal ttl, given;
                        decimal.TryParse(arr[0], out ttl);
                        decimal.TryParse(arr[1], out given);
                        if (given > ttl) {
                            decimal chng = given - ttl;
                            decimal dollars = Math.Truncate(chng);
                            chng = chng - dollars;
                            decimal outofCoin = 0.5m;
                            if ((ttl * 100) % 3 == 0) {
                                // always between 1, 2, or 3
                                int rnd = _r.Next(1, 4);
                                if (rnd == 3)
                                    rnd = 5;
                                outofCoin = 0.05m * rnd;
                            }
                            string fmt = Change.GetListOfChange(chng, outofCoin);
                            writeOut.Add(string.Format("{0} {1}", (dollars > 0 ? (dollars + " dollar" + (dollars == 1 ? "" : "s")) : ""), fmt));
                        } else {
                            decimal chng = ttl - given;
                            if (chng == 0)
                                writeOut.Add("No change needed");
                            else
                                writeOut.Add(string.Format("Still need {0}", chng));
                        }
                    } else {
                        throw new Exception(string.Format("Format not correct in file {1} at line {0}", count, file));
                    }
                } else {
                    throw new Exception(string.Format("Expected comma in file {1} at line {0}", count, file));
                }
            }
            if (writeOut.Count > 0) {
            // try catch in preceding method 
            // output results to new file in same folder ending with _cmpl
                string newfilename = file.Substring(0,file.Length-4) + "_cmpl.txt";
                string curfilepath = Path.GetDirectoryName(file)+"\\";
                if (!Directory.Exists(outPutFolderPath)) {
                    Directory.CreateDirectory(outPutFolderPath);
                }
                newfilename = newfilename.Replace(curfilepath,outPutFolderPath);
                File.WriteAllLines(newfilename, writeOut);
                }
            }
            
        private static List<string> HandleFile(string file = null) {
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
                throw new Exception(string.Format("Error occured in {2} for file {1} at line {0}", count, file, System.Reflection.MethodBase.GetCurrentMethod().Name), e);
            }
            return lines;
        }
        private static void MoveFile(string fullfilepath, string filename, string ToFolder) {
            try {
                if (!Directory.Exists(ToFolder)) {
                    Directory.CreateDirectory(ToFolder);
                }
                string processedFilePath = ToFolder + filename;
                File.Move(fullfilepath, processedFilePath);
            } catch (Exception e) {
                l.Output(string.Format("Unable to Move File {0} to {1} ", fullfilepath, ToFolder), e, System.Reflection.MethodBase.GetCurrentMethod().Name);
            }
        }
    }
    }
   