using CashRegister.Core.Models;
using FluentValidation;

namespace CashRegister.Core.Validators;

/// <summary>
/// Validates that a <see cref="TransactionInput"/> represents a valid cash register transaction.
/// </summary>
public class TransactionInputValidator : AbstractValidator<TransactionInput>
{
    public TransactionInputValidator()
    {
        RuleFor(x => x.OwedAmountInCents)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Owed amount must be greater than or equal to $0.00.");

        RuleFor(x => x.PaidAmountInCents)
            .GreaterThan(0)
            .WithMessage("Paid amount must be greater than $0.00.");

        RuleFor(x => x.PaidAmountInCents)
            .GreaterThanOrEqualTo(x => x.OwedAmountInCents)
            .WithMessage("Paid amount must be greater than or equal to the owed amount.");

        RuleFor(x => x.OwedAmountInCents)
            .Must(BeValidCentAmount)
            .WithMessage("Owed amount must have at most 2 decimal places.");

        RuleFor(x => x.PaidAmountInCents)
            .Must(BeValidCentAmount)
            .WithMessage("Paid amount must have at most 2 decimal places.");
    }

    private static bool BeValidCentAmount(int amountInCents) => amountInCents >= 0;
}
