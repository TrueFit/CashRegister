using CashRegister.API.DTOs;
using CashRegister.Core.Models;
using CashRegister.Core.Services;
using CashRegister.Core.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace CashRegister.API.Controllers;

/// <summary>
/// Handles change calculation operations for the cash register.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ChangeController : ControllerBase
{
    private readonly IChangeService _changeService;
    private readonly IFileParserService _fileParserService;
    private readonly IValidator<TransactionInput> _validator;
    private readonly ICurrencyRegistry _currencyRegistry;

    public ChangeController(
        IChangeService changeService,
        IFileParserService fileParserService,
        IValidator<TransactionInput> validator,
        ICurrencyRegistry currencyRegistry)
    {
        _changeService = changeService;
        _fileParserService = fileParserService;
        _validator = validator;
        _currencyRegistry = currencyRegistry;
    }

    /// <summary>
    /// Calculates change for all transactions in an uploaded flat file (one "owed,paid" pair per line).
    /// </summary>
    /// <param name="file">
    /// A text file where each line contains a comma-separated owed/paid pair.
    /// </param>
    /// <response code="200">Returns the list of change calculations.</response>
    /// <response code="400">The file is missing, empty, or contains invalid data.</response>
    [HttpPost("calculate")]
    [ProducesResponseType(typeof(List<ChangeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult CalculateFromFile(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return Problem(
                title: "Invalid file",
                detail: "A non-empty file is required.",
                statusCode: StatusCodes.Status400BadRequest);

        List<TransactionInput> transactions;
        try
        {
            using var stream = file.OpenReadStream();
            transactions = _fileParserService.Parse(stream).ToList();
        }
        catch (FormatException ex)
        {
            return Problem(
                title: "File parse error",
                detail: ex.Message,
                statusCode: StatusCodes.Status400BadRequest);
        }

        if (transactions.Count == 0)
            return Problem(
                title: "Empty file",
                detail: "The file contains no valid transaction lines.",
                statusCode: StatusCodes.Status400BadRequest);

        // Validate all transactions before processing.
        var errors = new List<string>();
        for (var i = 0; i < transactions.Count; i++)
        {
            var validationResult = _validator.Validate(transactions[i]);
            if (!validationResult.IsValid)
            {
                foreach (var error in validationResult.Errors)
                    errors.Add($"Line {i + 1}: {error.ErrorMessage}");
            }
        }

        if (errors.Count > 0)
            return Problem(
                title: "Validation failed",
                detail: string.Join(" ", errors),
                statusCode: StatusCodes.Status400BadRequest);

        // Calculate change for each transaction.
        var results = transactions
            .Select(t => MapToResponse(_changeService.CalculateChange(t.OwedAmount, t.PaidAmount)))
            .ToList();

        return Ok(results);
    }

    /// <summary>Calculates change for a single transaction.</summary>
    /// <param name="request">The owed and paid amounts.</param>
    /// <response code="200">Returns the change calculation.</response>
    /// <response code="400">The request contains invalid data.</response>
    [HttpPost("calculate-single")]
    [ProducesResponseType(typeof(ChangeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult CalculateSingle([FromBody] ChangeRequest request)
    {
        // Convert to cents for validation.
        var owedInCents = (int)Math.Round(request.Owed * 100m, MidpointRounding.ToEven);
        var paidInCents = (int)Math.Round(request.Paid * 100m, MidpointRounding.ToEven);
        var transaction = new TransactionInput(owedInCents, paidInCents);

        var validationResult = _validator.Validate(transaction);
        if (!validationResult.IsValid)
        {
            var errors = string.Join(" ", validationResult.Errors.Select(e => e.ErrorMessage));
            return Problem(
                title: "Validation failed",
                detail: errors,
                statusCode: StatusCodes.Status400BadRequest);
        }

        try
        {
            var result = _changeService.CalculateChange(request.Owed, request.Paid);
            return Ok(MapToResponse(result));
        }
        catch (ArgumentException ex)
        {
            return Problem(
                title: "Calculation error",
                detail: ex.Message,
                statusCode: StatusCodes.Status400BadRequest);
        }
    }

    /// <summary>Returns all registered currencies with their denominations.</summary>
    /// <response code="200">Returns the list of available currencies.</response>
    [HttpGet("currencies")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCurrencies()
    {
        var currencies = _currencyRegistry.GetAll()
            .Select(c => new
            {
                c.Code,
                c.Name,
                Denominations = c.Denominations.Select(d => new
                {
                    d.Name,
                    d.Value,
                    d.ValueInCents
                })
            });

        return Ok(currencies);
    }

    private static ChangeResponse MapToResponse(ChangeResult result)
    {
        var breakdown = result.Breakdown
            .Where(kvp => kvp.Value > 0)
            .ToDictionary(kvp => kvp.Key.Name, kvp => kvp.Value);

        return new ChangeResponse(
            Owed: result.OwedAmount,
            Paid: result.PaidAmount,
            Change: result.ChangeAmount,
            Formatted: result.ToFormattedString(),
            IsRandom: result.IsRandom,
            Breakdown: breakdown);
    }
}
