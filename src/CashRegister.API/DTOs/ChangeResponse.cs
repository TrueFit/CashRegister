namespace CashRegister.API.DTOs;

/// <summary>
/// Response for a change calculation containing the full denomination breakdown.
/// </summary>
/// <param name="Owed">The amount owed by the customer.</param>
/// <param name="Paid">The amount paid by the customer.</param>
/// <param name="Change">The change amount returned to the customer.</param>
/// <param name="Formatted">
/// Human-readable formatted string (e.g., "3 quarters,1 dime,3 pennies").
/// </param>
/// <param name="IsRandom">Whether the denomination breakdown was randomly generated.</param>
/// <param name="Breakdown">
/// Dictionary mapping denomination name to count (e.g., { "quarter": 3, "dime": 1 }).
/// Only denominations with non-zero counts are included.
/// </param>
public record ChangeResponse(
    decimal Owed,
    decimal Paid,
    decimal Change,
    string Formatted,
    bool IsRandom,
    Dictionary<string, int> Breakdown);
