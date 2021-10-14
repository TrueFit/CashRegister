using CsvHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models;
using Services;
using System;
using System.Collections.Generic;
using System.IO;


namespace CashRegester.Controllers
{
    public class UploadController : Controller
    {
        private string _extension = "crtp";
        // GET: Upload
        public ActionResult UploadFile()
        {
            ViewBag.Extension = _extension;
            return View();
        }
        [HttpPost]
        public IActionResult UploadFile(IFormFile file)
        {
            try
            {
                List<CashRegisterTape> list = new List<CashRegisterTape>();
                List<ChangeReturned> retList = new List<ChangeReturned>();
                if (file.FileName.Substring(file.FileName.IndexOf('.') + 1) != _extension)
                {
                    ViewBag.Message = "File must be of type \"" + _extension + "\"!!";
                    return View();
                }
                if (file.Length > 0)
                {

                    using (var reader = new StreamReader(file.OpenReadStream()))
                    {

                        while (!reader.EndOfStream)
                        {
                            var receipt = reader.ReadLine();

                            string owedStr = receipt.Substring(0, receipt.IndexOf(','));
                            string paidStr = receipt.Substring(receipt.IndexOf(',') + 1);
                            decimal owed;
                            decimal paid;
                            if (decimal.TryParse(owedStr, out owed) && decimal.TryParse(paidStr, out paid))
                            {
                                CashRegisterTape crt = new CashRegisterTape();
                                crt.Owed = owed;
                                crt.Paid = paid;
                                list.Add(crt);
                            }
                            else
                            {
                                ViewBag.Message = "Failed to retrieve Owed and Paid values!!";
                                return View();
                            }                   

                        }
                        CalculatorService calcService = new CalculatorService(new Calculator.Calculator());
                        retList = calcService.Calculate(list);                        

                        byte[] result;
                        using (var memoryStream = new MemoryStream())
                        {
                            using (var streamWriter = new StreamWriter(memoryStream))
                            {
                                using (var csvWriter = new CsvWriter(streamWriter,System.Globalization.CultureInfo.CurrentCulture))
                                {
                                    csvWriter.WriteRecords(retList);
                                    csvWriter.NextRecord();
                                    streamWriter.Flush();
                                    result = memoryStream.ToArray();
                                }
                            }
                        }

                        return new FileStreamResult(new MemoryStream(result), "text/csv") { FileDownloadName = "Change." + _extension };

                    }
                }
                ViewBag.Message = "File Uploaded Successfully!!";
                return View();
            }
            catch (Exception ex)
            {
                ViewBag.Message = "File upload failed!!";
                return View();
            }
        }
    }
}
