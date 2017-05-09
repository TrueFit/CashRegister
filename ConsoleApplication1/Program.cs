using CashRegister.Services;
using System;
using System.IO;

namespace CashRegister.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {            
            Console.WriteLine("Enter the path to the local input file and press enter.");
            var inputPath = Console.ReadLine();

            Console.WriteLine("Enter the path to the local output file and press enter.");
            var outputPath = Console.ReadLine();

            var outputFileService = new OutputFileService(outputPath);
            outputFileService.ProcessOutputFile();

            if (File.Exists(inputPath))
            {
                var inputFileService = new InputFileService();
                inputFileService.ProcessLocalInputFile(inputPath, outputFileService);
                Console.WriteLine("File {0} has finished processing and outputs written to file {1}", inputPath, outputPath);
            }
            else
                outputFileService.WriteLine(string.Format("Unable to locate file {0}. No file was processed.", inputPath));

            Console.WriteLine("Press any key to close application.");
            Console.ReadKey();
        }
    }
}
