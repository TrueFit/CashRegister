using System.Threading.Tasks;
using CashRegister.Api.Core.Filters;
using CashRegister.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashRegister.Controllers
{
    [Route("api/[controller]")]
    public class CashRegisterController : Controller
    {
        private readonly IRegisterService _registerService;
        public CashRegisterController(IRegisterService registerService)
        {
            _registerService = registerService;
        }

        [HttpPost]
        [MultipartRequestValidationFilter]
        public async Task<IActionResult> Process([FromForm] IFormFile file)
        {
            var result = await _registerService.CalculateChangeAsync(file);
            
            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }

            return File(result.Value.Data, result.Value.ContentType, result.Value.FileName);
        }
    }
}
