using CashRegister.Core.Strategies;

namespace CashRegister.Core.Rules;

/// <summary>
/// Defines a rule that determines which <see cref="IChangeStrategy"/> should be used
/// for a given transaction.
/// </summary>
/// <remarks>
/// <para>
/// Rules are evaluated in registration order. The first rule whose
/// <see cref="Applies"/> method returns <c>true</c> determines the strategy.
/// If no rule matches, <see cref="MinimumChangeStrategy"/> is used as the default.
/// </para>
/// <para>
/// To add a new business rule (e.g., "if amount exceeds $100, use only bills"),
/// implement this interface and register it in the DI container. No existing
/// code needs to change (Open/Closed Principle).
/// </para>
/// </remarks>
public interface IChangeRule
{
    /// <summary>
    /// Determines whether this rule applies to the given owed amount.
    /// </summary>
    /// <param name="owedAmountInCents">The amount owed by the customer, in cents.</param>
    /// <returns><c>true</c> if this rule's strategy should be used; otherwise, <c>false</c>.</returns>
    bool Applies(int owedAmountInCents);

    /// <summary>
    /// Gets the <see cref="IChangeStrategy"/> to use when this rule applies.
    /// </summary>
    /// <returns>The strategy instance for calculating change.</returns>
    IChangeStrategy GetStrategy();
}
