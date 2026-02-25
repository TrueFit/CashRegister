using CashRegister.Core.Models;

namespace CashRegister.Core.Services;

/// <summary>
/// Default implementation of <see cref="ICurrencyRegistry"/>, pre-populated with USD and EUR.
/// </summary>
public class CurrencyRegistry : ICurrencyRegistry
{
    private readonly Dictionary<string, Currency> _currencies = new(StringComparer.OrdinalIgnoreCase);

    public CurrencyRegistry()
    {
        Register(Currency.USD());
        Register(Currency.EUR());
    }

    public void Register(Currency currency)
    {
        ArgumentNullException.ThrowIfNull(currency);
        _currencies[currency.Code] = currency;
    }

    /// <inheritdoc />
    public Currency GetCurrency(string code)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        if (_currencies.TryGetValue(code, out var currency))
            return currency;

        throw new KeyNotFoundException(
            $"Currency '{code}' is not registered. Available currencies: {string.Join(", ", _currencies.Keys)}.");
    }

    /// <inheritdoc />
    public IEnumerable<Currency> GetAll() => _currencies.Values;
}
