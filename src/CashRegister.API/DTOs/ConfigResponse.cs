namespace CashRegister.API.DTOs;

/// <summary>
/// Response containing the current cash register configuration.
/// </summary>
/// <param name="RandomDivisor">The current random divisor value.</param>
/// <param name="CurrencyCode">The current currency code.</param>
public record ConfigResponse(int RandomDivisor, string CurrencyCode);
