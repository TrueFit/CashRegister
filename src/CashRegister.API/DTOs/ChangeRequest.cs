namespace CashRegister.API.DTOs;

/// <summary>
/// Request body for a single change calculation.
/// </summary>
/// <param name="Owed">The amount owed by the customer (e.g., 2.13).</param>
/// <param name="Paid">The amount paid by the customer (e.g., 3.00). Must be >= Owed.</param>
public record ChangeRequest(decimal Owed, decimal Paid);
