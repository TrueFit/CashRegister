using System;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;

namespace CashRegister
{
    public class ErrorLog
    {
        private string ErrorFilePath;
        private StreamWriter ErrorWriter;
        public ErrorLog(string fileName)
        {
            ErrorFilePath = fileName;

            try
            {
                // check if the file is already present,
                // if the file is not present, create a new file
                // else open the file in append mode
                if (!CheckFile())
                {
                    CreateFile();
                }
                else
                {
                    ErrorWriter = File.AppendText(ErrorFilePath);
                }
            }
            catch (Exception ex)
            {

            }
        }

        /// <summary>
        /// Creates the file and inserts the file header
        /// </summary>
        private void CreateFile()
        {
            try
            {
                // create a text file at the given path
                ErrorWriter = File.CreateText(ErrorFilePath);
                // place the error file header
                var fileHeader = "******************************" + Environment.NewLine +
                    "Error Log" + Environment.NewLine + "******************************";
                ErrorWriter.WriteLine(fileHeader);
            }
            catch (Exception ex)
            {
            }

        }

        /// <summary>
        /// Checks if the file is already present
        /// </summary>
        /// <returns>True if the file exists</returns>
        private bool CheckFile()
        {
            // check if the file already exists
            if (File.Exists(ErrorFilePath))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Gets the STackTraceInfo from the STackFram and returns the last three calling functions
        /// </summary>
        /// <returns>Last three function calls before the exception occurred.</returns>
        private string getStackTraceInfo()
        {

            StackTrace trace = new StackTrace(2);
            List<StackFrame> stackFrames = new List<StackFrame>(trace.GetFrames());
            var output = " --> " + stackFrames[1].GetMethod().DeclaringType.Name + "-" + stackFrames[1].GetMethod().Name + Environment.NewLine;
            return output;
        }

        /// <summary>
        /// Formats the error string for writing to a log file.
        /// </summary>
        /// <param name="errorMessage">Error message written to the log file.</param>
        /// <returns>Formatted error string.</returns>
        private string FrameErrorString(string errorMessage)
        {
            var stackTrace = getStackTraceInfo();
            var error = errorMessage + Environment.NewLine + "Error occurred at: " + stackTrace + Environment.NewLine;
            return error;
        }

        /// <summary>
        /// Writes the error messages to the file
        /// </summary>
        /// <param name="errorMessage"></param>
        public void WriteError(string errorMessage)
        {
            if (ErrorWriter != null)
            {
                try
                {
                    string errorString = FrameErrorString(errorMessage);
                    //write the error to the file
                    ErrorWriter.Write(ErrorWriter.NewLine);
                    ErrorWriter.Write(errorString);
                    ErrorWriter.Close();
                }
                catch (Exception ex)
                {
                }
            }
        }
    }
}