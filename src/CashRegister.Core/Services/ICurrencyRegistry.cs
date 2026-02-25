using CashRegister.Core.Models;

namespace CashRegister.Core.Services;

/// <summary>
/// A registry of available currencies and their denominations.
/// </summary>
/// <remarks>
/// Implementations should be registered as singletons in the DI container
/// since currency definitions are static reference data.
/// </remarks>
public interface ICurrencyRegistry
{
    /// <summary>
    /// Retrieves a currency by its ISO 4217 code.
    /// </summary>
    /// <param name="code">The currency code (e.g., "USD", "EUR"). Case-insensitive.</param>
    /// <returns>The matching <see cref="Currency"/>.</returns>
    /// <exception cref="KeyNotFoundException">
    /// Thrown when no currency with the specified <paramref name="code"/> is registered.
    /// </exception>
    Currency GetCurrency(string code);

    /// <summary>
    /// Returns all registered currencies.
    /// </summary>
    /// <returns>An enumerable of all available <see cref="Currency"/> definitions.</returns>
    IEnumerable<Currency> GetAll();
}
