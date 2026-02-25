using CashRegister.Core.Models;

namespace CashRegister.Core.Services;

/// <summary>
/// Orchestrates change calculation for a single transaction.
/// </summary>
/// <remarks>
/// This is the primary entry point for business logic. It coordinates
/// rule evaluation, strategy selection, and denomination breakdown.
/// </remarks>
public interface IChangeService
{
    /// <summary>
    /// Calculates the change breakdown for a transaction.
    /// </summary>
    /// <param name="owed">The amount owed by the customer (e.g., 2.13m).</param>
    /// <param name="paid">The amount paid by the customer (e.g., 3.00m). Must be >= <paramref name="owed"/>.</param>
    /// <returns>
    /// A <see cref="ChangeResult"/> containing the denomination breakdown,
    /// whether it was randomly generated, and all monetary amounts.
    /// </returns>
    /// <exception cref="ArgumentException">
    /// Thrown when <paramref name="paid"/> is less than <paramref name="owed"/>.
    /// </exception>
    ChangeResult CalculateChange(decimal owed, decimal paid);
}
