using System;
using System.IO;
using Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Services;

namespace CashRegisterConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");


            IConfiguration config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", true, true)
                .Build();

            var filepath = args[0];
            var delimeter =args.Length>1?args[1]: config["Delimeter"];
            var currency = args.Length > 2 ? args[2] : config["Currency"];
            var div = args.Length > 3 ? args[3] : config["Divisor"];
            var divisor = Convert.ToInt32(div);

            var serviceProvider = new ServiceCollection()
                .AddSingleton<IChangeService>( new ChangeService(delimeter,currency,divisor))
                .BuildServiceProvider();

     
            if (string.IsNullOrWhiteSpace(filepath) || !File.Exists(filepath))
            {
                Console.WriteLine($"File at path {filepath} does not exist");
            }
           
            var service = serviceProvider.GetService<IChangeService>();
            var result = service.Process(File.Open(filepath, FileMode.Open));
            foreach (var r in result)
            {
                Console.WriteLine(r);
            }
                
        }
    }
}
