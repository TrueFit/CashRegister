namespace CashRegister.Core.Configuration;

/// <summary>
/// Configuration settings for the cash register application.
/// Registered as a singleton — can be updated at runtime via the API.
/// Thread-safe for concurrent reads and writes.
/// </summary>
public class CashRegisterSettings
{
    /// <summary>
    /// The configuration section name for binding from appsettings.json.
    /// </summary>
    public const string SectionName = "CashRegister";

    private readonly object _lock = new();
    private int _randomDivisor = 3;
    private string _currencyCode = "USD";

    /// <summary>
    /// Gets or sets the divisor used to determine if change should be randomly generated.
    /// When the owed amount (in cents) is divisible by this value, random denominations are used.
    /// </summary>
    /// <value>Defaults to 3.</value>
    public int RandomDivisor
    {
        get { lock (_lock) return _randomDivisor; }
        set { lock (_lock) _randomDivisor = value; }
    }

    /// <summary>
    /// Gets or sets the ISO 4217 currency code to use for denominations.
    /// </summary>
    /// <value>Defaults to "USD".</value>
    public string CurrencyCode
    {
        get { lock (_lock) return _currencyCode; }
        set { lock (_lock) _currencyCode = value; }
    }
}
