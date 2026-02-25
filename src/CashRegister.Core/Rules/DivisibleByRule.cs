using CashRegister.Core.Configuration;
using CashRegister.Core.Strategies;

namespace CashRegister.Core.Rules;

/// <summary>
/// Applies when the owed amount (in cents) is evenly divisible by <see cref="CashRegisterSettings.RandomDivisor"/>.
/// </summary>
public class DivisibleByRule : IChangeRule
{
    private readonly CashRegisterSettings _settings;
    private readonly RandomChangeStrategy _strategy;

    public DivisibleByRule(CashRegisterSettings settings, RandomChangeStrategy strategy)
    {
        _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        _strategy = strategy ?? throw new ArgumentNullException(nameof(strategy));
    }

    /// <inheritdoc />
    public bool Applies(int owedAmountInCents)
    {
        var divisor = _settings.RandomDivisor;
        return owedAmountInCents % divisor == 0;
    }

    /// <inheritdoc />
    public IChangeStrategy GetStrategy() => _strategy;
}
