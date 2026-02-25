using System.Text;

namespace CashRegister.Core.Models;

/// <summary>
/// Represents the result of a change calculation, including the denomination breakdown.
/// </summary>
public class ChangeResult
{
    public int OwedAmountInCents { get; }
    public int PaidAmountInCents { get; }
    public int ChangeAmountInCents { get; }

    public decimal OwedAmount => OwedAmountInCents / 100m;
    public decimal PaidAmount => PaidAmountInCents / 100m;
    public decimal ChangeAmount => ChangeAmountInCents / 100m;

    public IReadOnlyDictionary<Denomination, int> Breakdown { get; }

    /// <summary>True when the breakdown was randomly generated (owed divisible by the configured divisor).</summary>
    public bool IsRandom { get; }

    public ChangeResult(
        int owedAmountInCents,
        int paidAmountInCents,
        Dictionary<Denomination, int> breakdown,
        bool isRandom)
    {
        OwedAmountInCents = owedAmountInCents;
        PaidAmountInCents = paidAmountInCents;
        ChangeAmountInCents = paidAmountInCents - owedAmountInCents;
        Breakdown = breakdown;
        IsRandom = isRandom;
    }

    /// <summary>Returns the breakdown as a comma-separated string, e.g. "3 quarters,1 dime,3 pennies".</summary>
    public string ToFormattedString()
    {
        var parts = new List<string>();

        foreach (var (denomination, count) in Breakdown)
        {
            if (count <= 0)
                continue;

            var name = count == 1 ? denomination.Name : denomination.PluralName;
            parts.Add($"{count} {name}");
        }

        return string.Join(",", parts);
    }
}
