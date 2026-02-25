namespace CashRegister.Core.Models;

/// <summary>
/// Represents a parsed line from the input file containing a single transaction.
/// All monetary amounts are stored as cents internally to avoid floating-point issues.
/// </summary>
/// <param name="OwedAmountInCents">The amount owed by the customer in cents.</param>
/// <param name="PaidAmountInCents">The amount paid by the customer in cents.</param>
public record TransactionInput(int OwedAmountInCents, int PaidAmountInCents)
{
    /// <summary>
    /// Gets the amount owed as a decimal dollar value.
    /// </summary>
    public decimal OwedAmount => OwedAmountInCents / 100m;

    /// <summary>
    /// Gets the amount paid as a decimal dollar value.
    /// </summary>
    public decimal PaidAmount => PaidAmountInCents / 100m;

    /// <summary>
    /// Gets the change due in cents.
    /// </summary>
    public int ChangeInCents => PaidAmountInCents - OwedAmountInCents;
}
