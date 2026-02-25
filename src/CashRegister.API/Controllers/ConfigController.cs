using CashRegister.API.DTOs;
using CashRegister.Core.Configuration;
using CashRegister.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CashRegister.API.Controllers;

/// <summary>
/// Manages cash register configuration at runtime.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ConfigController : ControllerBase
{
    private readonly CashRegisterSettings _settings;
    private readonly ICurrencyRegistry _currencyRegistry;

    public ConfigController(
        CashRegisterSettings settings,
        ICurrencyRegistry currencyRegistry)
    {
        _settings = settings;
        _currencyRegistry = currencyRegistry;
    }

    /// <summary>Returns the current configuration.</summary>
    /// <response code="200">Returns the current configuration.</response>
    [HttpGet]
    [ProducesResponseType(typeof(ConfigResponse), StatusCodes.Status200OK)]
    public IActionResult GetConfig()
    {
        return Ok(new ConfigResponse(_settings.RandomDivisor, _settings.CurrencyCode));
    }

    /// <summary>Updates configuration at runtime. Only non-null fields are applied.</summary>
    /// <response code="200">Returns the updated configuration.</response>
    /// <response code="400">The request contains invalid data.</response>
    [HttpPut]
    [ProducesResponseType(typeof(ConfigResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult UpdateConfig([FromBody] ConfigRequest request)
    {
        // Validate RandomDivisor if provided.
        if (request.RandomDivisor.HasValue && request.RandomDivisor.Value <= 0)
            return Problem(
                title: "Invalid random divisor",
                detail: "Random divisor must be greater than zero.",
                statusCode: StatusCodes.Status400BadRequest);

        // Validate CurrencyCode if provided.
        if (request.CurrencyCode is not null)
        {
            try
            {
                _currencyRegistry.GetCurrency(request.CurrencyCode);
            }
            catch (KeyNotFoundException)
            {
                var available = string.Join(", ",
                    _currencyRegistry.GetAll().Select(c => c.Code));
                return Problem(
                    title: "Invalid currency code",
                    detail: $"Currency '{request.CurrencyCode}' is not registered. Available: {available}.",
                    statusCode: StatusCodes.Status400BadRequest);
            }
        }

        // Write directly to the singleton — all readers see the update immediately.
        if (request.RandomDivisor.HasValue)
            _settings.RandomDivisor = request.RandomDivisor.Value;

        if (request.CurrencyCode is not null)
            _settings.CurrencyCode = request.CurrencyCode;

        return Ok(new ConfigResponse(_settings.RandomDivisor, _settings.CurrencyCode));
    }
}
