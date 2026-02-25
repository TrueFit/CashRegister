using CashRegister.Core.Models;

namespace CashRegister.Core.Strategies;

/// <summary>
/// Randomized strategy that distributes change across denominations non-deterministically.
/// The final denomination always absorbs the remainder to guarantee a correct total.
/// </summary>
public class RandomChangeStrategy : IChangeStrategy
{
    private readonly Random _random;

    /// <param name="random">Inject a seeded instance for deterministic test results.</param>
    public RandomChangeStrategy(Random random)
    {
        _random = random ?? throw new ArgumentNullException(nameof(random));
    }

    public RandomChangeStrategy()
        : this(Random.Shared)
    {
    }

    /// <inheritdoc />
    public Dictionary<Denomination, int> Calculate(int amountInCents, IReadOnlyList<Denomination> denominations)
    {
        var breakdown = new Dictionary<Denomination, int>();
        var remaining = amountInCents;

        for (var i = 0; i < denominations.Count; i++)
        {
            var denomination = denominations[i];
            var maxCount = remaining / denomination.ValueInCents;

            if (i == denominations.Count - 1)
            {
                // Last denomination: assign whatever is needed to complete the total.
                breakdown[denomination] = maxCount;
            }
            else
            {
                // Random count between 0 and maxCount (inclusive).
                var count = maxCount > 0 ? _random.Next(0, maxCount + 1) : 0;
                breakdown[denomination] = count;
                remaining -= count * denomination.ValueInCents;
            }
        }

        return breakdown;
    }
}
