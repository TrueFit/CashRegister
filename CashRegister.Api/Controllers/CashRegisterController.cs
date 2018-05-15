using System.Collections.Generic;
using System.Threading.Tasks;
using CashRegister.Api.Core.Filters;
using CashRegister.Api.Services;
using CashRegister.Domain.SalesAggregate;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CashRegister.Controllers
{
    [Route("api/[controller]")]
    public class CashRegisterController : Controller
    {
        private readonly IRegisterService _registerService;
        private readonly IMediator _mediator;

        public CashRegisterController(IRegisterService registerService,
                                        IMediator mediator)
        {
            _registerService = registerService;
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            var parseResult = await _registerService.ParseSalesAsync(file);

            if (parseResult.IsFailure)
            {
                return BadRequest(parseResult.Error);
            }

            var commandResult = CalculateChange.Create(parseResult.Value);

            if (commandResult.IsFailure)
            {
                return BadRequest(commandResult.Error);
            }

            await _mediator.Send(commandResult.Value);

            return Ok();
        }
    }
}
