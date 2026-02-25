namespace CashRegister.Core.Models;

/// <summary>
/// Represents a currency with its available denominations.
/// Denominations are ordered from highest to lowest value.
/// </summary>
/// <param name="Code">The ISO 4217 currency code (e.g., "USD").</param>
/// <param name="Name">The display name of the currency (e.g., "US Dollar").</param>
/// <param name="Denominations">The available denominations, ordered highest to lowest.</param>
public record Currency(string Code, string Name, IReadOnlyList<Denomination> Denominations)
{
    /// <summary>
    /// Creates the US Dollar currency with standard denominations.
    /// </summary>
    public static Currency USD() => new(
        "USD",
        "US Dollar",
        new List<Denomination>
        {
            new("dollar", 100),
            new("quarter", 25),
            new("dime", 10),
            new("nickel", 5),
            new("penny", 1)
        });

    /// <summary>
    /// Creates the Euro currency with standard denominations.
    /// </summary>
    public static Currency EUR() => new(
        "EUR",
        "Euro",
        new List<Denomination>
        {
            new("2 euro", 200),
            new("1 euro", 100),
            new("50 cent", 50),
            new("20 cent", 20),
            new("10 cent", 10),
            new("5 cent", 5),
            new("2 cent", 2),
            new("1 cent", 1)
        });
}
