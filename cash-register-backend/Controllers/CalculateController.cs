using cash_register_backend.DTOs;
using cash_register_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace cash_register_backend.Controllers
{
    /// <summary>
    /// Controller for handling calculation requests related to the cash register application.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class CalculateController : ControllerBase
    {
        private readonly ILogger<CalculateController> _logger;
        private readonly ICalculateService _calculateService;

        public CalculateController(ILogger<CalculateController> logger, ICalculateService calculateService)
        {
            _logger = logger;
            _calculateService = calculateService;
        }
        /// <summary>
        /// Calulates the change based on the input file provided in the request.
        /// Checks if the file is valid and returns the calculation results in CSV format.
        /// Checks if any rule applies such that the change could be randomly generated.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Calculate([FromForm] CalculateDTO dto)
        {
            if (dto?.InputFile == null || dto.InputFile.Length == 0)
                return BadRequest("File is required.");


            var results = await _calculateService.CalculateChange(dto);
            if (results == null)
                return BadRequest("Invalid File.");

            var csvContent = new StringBuilder();

            // Add rows
            
            foreach (var line in results)
            {
                csvContent.AppendLine(line);
            }

            return Ok(new CalculateResultDTO() { CalculationResults = csvContent.ToString() });
        }
    }
}
