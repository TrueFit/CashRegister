namespace CashRegister.API.DTOs;

/// <summary>
/// Request body for updating cash register configuration at runtime.
/// All properties are optional; only provided values are applied.
/// </summary>
/// <param name="RandomDivisor">
/// The divisor used to trigger random change generation.
/// When the owed amount (in cents) is divisible by this value, random denominations are used.
/// Must be greater than zero.
/// </param>
/// <param name="CurrencyCode">
/// The ISO 4217 currency code (e.g., "USD", "EUR").
/// Must correspond to a registered currency.
/// </param>
public record ConfigRequest(int? RandomDivisor, string? CurrencyCode);
