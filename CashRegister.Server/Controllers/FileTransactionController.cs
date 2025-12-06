using CashRegister.Server.Models;
using CashRegister.Server.Utilities;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace CashRegister.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileTransactionController : ControllerBase
    {
        [HttpPost(Name = "PostFileUpload")]
        public async Task<IActionResult> Post()
        {
            var form = await Request.ReadFormAsync();
            if (form.TryGetValue("currency", out var currency))
            {
                if (form.Files.Count == 1 && form.Files[0] != null && form.Files[0].Length > 0)
                {
                    var uploadedLines = new List<string>();
                    using (var reader = new StreamReader(form.Files[0].OpenReadStream()))
                    {
                        string line;
                        while ((line = await reader.ReadLineAsync()) != null)
                        {
                            uploadedLines.Add(line);
                        }
                    }

                    var transHelper = new TillTransactionHelper(currency);
                    var returnedLines = new List<string>();

                    foreach (var line in uploadedLines)
                    {
                        var values = line.Split(",");
                        decimal due;
                        decimal paid;

                        if (decimal.TryParse(values[0], out due) && decimal.TryParse(values[1], out paid))
                        {
                            var change = transHelper.CalcChange(due, paid);
                            var denominationStrings = new List<string>();
                            foreach (var item in change) {
                                denominationStrings.Add(item.Count + " " + item.Denomination);
                            }
                            returnedLines.Add(string.Join(", ", denominationStrings) + ".");
                        }
                        else 
                        {
                            returnedLines.Add("Invalid ammount");
                        }
                    }

                    var returnFileContent = Encoding.UTF8.GetBytes(string.Join(System.Environment.NewLine, returnedLines));
                    return File(returnFileContent, "text/plain", "output.txt");
                }
            }

            return new BadRequestResult();
        }
    }
}
