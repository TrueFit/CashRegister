using CashRegister.Core.Configuration;
using CashRegister.Core.Models;
using CashRegister.Core.Rules;
using CashRegister.Core.Strategies;

namespace CashRegister.Core.Services;

/// <summary>
/// Default implementation of <see cref="IChangeService"/>.
/// </summary>
public class ChangeService : IChangeService
{
    private readonly IEnumerable<IChangeRule> _rules;
    private readonly MinimumChangeStrategy _defaultStrategy;
    private readonly ICurrencyRegistry _currencyRegistry;
    private readonly CashRegisterSettings _settings;

    public ChangeService(
        IEnumerable<IChangeRule> rules,
        MinimumChangeStrategy defaultStrategy,
        ICurrencyRegistry currencyRegistry,
        CashRegisterSettings settings)
    {
        _rules = rules ?? throw new ArgumentNullException(nameof(rules));
        _defaultStrategy = defaultStrategy ?? throw new ArgumentNullException(nameof(defaultStrategy));
        _currencyRegistry = currencyRegistry ?? throw new ArgumentNullException(nameof(currencyRegistry));
        _settings = settings ?? throw new ArgumentNullException(nameof(settings));
    }

    /// <inheritdoc />
    public ChangeResult CalculateChange(decimal owed, decimal paid)
    {
        if (paid < owed)
            throw new ArgumentException(
                $"Paid amount ({paid:C}) cannot be less than owed amount ({owed:C}).",
                nameof(paid));

        // Convert to cents immediately to avoid all floating-point issues.
        var owedInCents = ToCents(owed);
        var paidInCents = ToCents(paid);
        var changeInCents = paidInCents - owedInCents;

        // Resolve the configured currency (reads current value from singleton).
        var currency = _currencyRegistry.GetCurrency(_settings.CurrencyCode);

        // Select strategy: first matching rule wins, otherwise use the default.
        var (strategy, isRandom) = SelectStrategy(owedInCents);

        // Execute the selected strategy.
        var breakdown = strategy.Calculate(changeInCents, currency.Denominations);

        return new ChangeResult(owedInCents, paidInCents, breakdown, isRandom);
    }

    /// <summary>
    /// Evaluates rules in order and returns the first matching strategy,
    /// or the default strategy if no rules match.
    /// </summary>
    private (IChangeStrategy strategy, bool isRandom) SelectStrategy(int owedInCents)
    {
        foreach (var rule in _rules)
        {
            if (rule.Applies(owedInCents))
                return (rule.GetStrategy(), isRandom: true);
        }

        return (_defaultStrategy, isRandom: false);
    }

    /// <summary>
    /// Converts a decimal dollar amount to integer cents using banker's rounding.
    /// </summary>
    /// <param name="amount">The decimal dollar amount (e.g., 2.13m).</param>
    /// <returns>The equivalent amount in cents (e.g., 213).</returns>
    private static int ToCents(decimal amount)
    {
        return (int)Math.Round(amount * 100m, MidpointRounding.ToEven);
    }
}
