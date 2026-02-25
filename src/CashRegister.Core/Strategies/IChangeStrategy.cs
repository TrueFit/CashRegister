using CashRegister.Core.Models;

namespace CashRegister.Core.Strategies;

/// <summary>
/// Defines a strategy for calculating the denomination breakdown of a change amount.
/// Implementations determine how change is distributed across available denominations.
/// </summary>
/// <remarks>
/// This is the Strategy pattern entry point. New change calculation algorithms
/// (e.g., prefer bills only, round to nearest nickel) can be added by implementing
/// this interface without modifying existing code.
/// </remarks>
public interface IChangeStrategy
{
    /// <summary>
    /// Calculates the denomination breakdown for the given change amount.
    /// </summary>
    /// <param name="amountInCents">The total change amount in cents. Must be non-negative.</param>
    /// <param name="denominations">
    /// The available denominations, ordered from highest to lowest value.
    /// </param>
    /// <returns>
    /// A dictionary mapping each used denomination to its count.
    /// The sum of (denomination value * count) must equal <paramref name="amountInCents"/>.
    /// </returns>
    Dictionary<Denomination, int> Calculate(int amountInCents, IReadOnlyList<Denomination> denominations);
}
