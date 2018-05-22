using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using CsvHelper;
using System.Linq;
using CashRegister.Common.Dto;
using CashRegister.Domain.SalesAggregate;
using System.Collections.Generic;
using CashRegister.Api.Core;

namespace CashRegister.Api.Services
{
    public interface IRegisterService
    {
        Task<Result<Attachment>> CalculateChangeAsync(IFormFile file);
    }

    public class RegisterService : IRegisterService
    {
        private readonly ILogger<RegisterService> _logger;
        private readonly ICashRegister _register;

        /* For whatever reason, my Windows machine is interperting
         * csv file as Excel and rejecting file during validation.
         * As a workaround, I'll allow Excel content type also.
        */
        private string[] _validContentTypes = new[] { "application/vnd.ms-excel", "text/csv" };

        public RegisterService(ILogger<RegisterService> logger,
                                ICashRegister register)
        {
            _logger = logger;
            _register = register;
        }

        private async Task<Result<SalesReceipt>> ParseSalesAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                const string message = "No file detected.";
                _logger.LogInformation(message);
                return Result.Fail<SalesReceipt>(message);
            }

            if (!_validContentTypes.Contains(file.ContentType, StringComparer.OrdinalIgnoreCase))
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

        /// <summary>
        /// Parses input file containing amount owed, amount paid and calculates amount change to return to customer
        /// </summary>
        /// <param name="salesInput"></param>
        /// <returns>File with expected change for each line item in original receipt</returns>
        public async Task<Result<Attachment>> CalculateChangeAsync(IFormFile salesInput)
        {
            var result = await ParseSalesAsync(salesInput);
            if (result.IsFailure) return Result.Fail<Attachment>(result.Error);

            if (result.Value.SaleItems == null || !result.Value.SaleItems.Any())
            {
                return Result.Fail<Attachment>("No items found in sales receipt.");
            }

            var results = new List<ChangeResult>();
            foreach (var sale in result.Value.SaleItems)
            {
                var requiredChange = _register.ProcessChange(sale.AmountOwed, sale.AmountPaid);
                results.Add(new ChangeResult(requiredChange));
            }

            var salesOutput = await GenerateOutputFileAsync(results);
            return Result.Ok(salesOutput);
        }

        private async Task<Attachment> GenerateOutputFileAsync(List<ChangeResult> changeResults)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var streamWriter = new StreamWriter(memoryStream))
                {
                    foreach(var result in changeResults)
                    {
                        await streamWriter.WriteLineAsync(result.ChangeDueFormatted);
                    }

                    await streamWriter.FlushAsync();
                    memoryStream.Seek(0, SeekOrigin.Begin);

                    var attachment = new Attachment
                    {
                        Data = memoryStream.ToArray(),
                        FileName = $"Change-Owed-{DateTime.Now.ToString("s")}.txt",
                        ContentType = "text/plain"
                    };

                    return attachment;
                }
            }
        }
    }
}
