using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using CsvHelper;
using CashRegister.Domain.SalesAggregate;
using System.Linq;

namespace CashRegister.Api.Services
{
    public interface IRegisterService
    {
        Task<Result<SalesReceipt>> ParseSalesAsync(IFormFile file);
    }

    public class RegisterService : IRegisterService
    {
        private readonly ILogger<RegisterService> _logger;
        private const string csvContentType = "text/csv";

        public RegisterService(ILogger<RegisterService> logger)
        {
            _logger = logger;
        }

        public async Task<Result<SalesReceipt>> ParseSalesAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                const string message = "No file detected.";
                _logger.LogInformation(message);
                return Result.Fail<SalesReceipt>(message);
            }

            if (!file.ContentType.Equals(csvContentType, StringComparison.OrdinalIgnoreCase))
            {
                const string message = "Please upload a CSV file for sales upload.";
                _logger.LogInformation(message);
                return Result.Fail<SalesReceipt>(message);
            }

            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream).ConfigureAwait(false);
                    memoryStream.Seek(0, SeekOrigin.Begin);

                    using (var reader = new StreamReader(memoryStream))
                    {
                        var csv = new CsvReader(reader);
                        csv.Configuration.HasHeaderRecord = false;

                        var sales = csv.GetRecords<SaleItem>().ToList();
                        var receipt = new SalesReceipt(sales);

                        return Result.Ok(receipt);
                    }
                        
                }
            }
            catch (Exception ex)
            {
                const string error = "Unable to parse uploaded sales file.";
                _logger.LogError(ex, error);
                return Result.Fail<SalesReceipt>(error);
            }
        }
    }
}
