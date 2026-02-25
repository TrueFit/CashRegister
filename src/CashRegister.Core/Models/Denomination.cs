namespace CashRegister.Core.Models;

/// <summary>
/// Represents a single currency denomination (e.g., Quarter = $0.25).
/// All monetary values are stored as cents internally to avoid floating-point issues.
/// </summary>
/// <param name="Name">The display name of the denomination (e.g., "quarter").</param>
/// <param name="ValueInCents">The value of this denomination in cents (e.g., 25 for a quarter).</param>
public record Denomination(string Name, int ValueInCents)
{
    /// <summary>
    /// Gets the denomination value as a decimal dollar amount.
    /// </summary>
    public decimal Value => ValueInCents / 100m;

    /// <summary>
    /// Gets the plural form of the denomination name.
    /// Handles the "penny" → "pennies" special case.
    /// </summary>
    public string PluralName => Name.EndsWith("y") ? $"{Name[..^1]}ies" : $"{Name}s";
}
