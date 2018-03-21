using System;
using System.Diagnostics;

namespace CashRegister {
    class Logger {
    public void EventLog(string message){
           string sSource = "Cash Register";
           string sLog = "Application";
            if (!System.Diagnostics.EventLog.SourceExists(sSource))
                System.Diagnostics.EventLog.CreateEventSource(sSource, sLog);
            System.Diagnostics.EventLog.WriteEntry(sSource, message,
            EventLogEntryType.Error, 2134);
        }
        public void Output(string message, Exception ex = null, string methodname = null) {
            if (!string.IsNullOrWhiteSpace(methodname)) {
                Console.WriteLine("Error in '{0}'", methodname);
            }
            if (ex != null) {
                string msg = ex.Message;
                if (ex.InnerException != null) {
                    msg += Environment.NewLine + "Inner:" + ex.InnerException.Message;
                }
                Console.WriteLine("[" + msg + "]");
                //EventLog(msg);
            }
                Console.WriteLine("{0}", message);
                //or write to a db if needed
        }
    }
}
