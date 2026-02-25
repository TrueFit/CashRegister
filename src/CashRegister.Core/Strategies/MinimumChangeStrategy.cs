using CashRegister.Core.Models;

namespace CashRegister.Core.Strategies;

/// <summary>
/// Greedy strategy that minimizes the total number of coins and bills returned.
/// </summary>
public class MinimumChangeStrategy : IChangeStrategy
{
    /// <inheritdoc />
    public Dictionary<Denomination, int> Calculate(int amountInCents, IReadOnlyList<Denomination> denominations)
    {
        var breakdown = new Dictionary<Denomination, int>();
        var remaining = amountInCents;

        foreach (var denomination in denominations)
        {
            var count = remaining / denomination.ValueInCents;
            breakdown[denomination] = count;
            remaining -= count * denomination.ValueInCents;
        }

        return breakdown;
    }
}
