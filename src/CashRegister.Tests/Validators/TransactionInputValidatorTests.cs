using CashRegister.Core.Models;
using CashRegister.Core.Validators;
using FluentAssertions;
using FluentValidation.TestHelper;

namespace CashRegister.Tests.Validators;

public class TransactionInputValidatorTests
{
    private readonly TransactionInputValidator _sut = new();

    // --- Valid inputs ---

    [Theory]
    [InlineData(212, 300)]
    [InlineData(0, 100)]
    [InlineData(100, 100)]
    [InlineData(1, 1)]
    [InlineData(999, 1000)]
    public void Validate_ValidInput_HasNoErrors(int owedCents, int paidCents)
    {
        var input = new TransactionInput(owedCents, paidCents);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveAnyValidationErrors();
    }

    // --- Owed amount must be >= 0 ---

    [Fact]
    public void Validate_NegativeOwedAmount_HasError()
    {
        var input = new TransactionInput(-1, 100);

        var result = _sut.TestValidate(input);

        result.ShouldHaveValidationErrorFor(x => x.OwedAmountInCents)
            .WithErrorMessage("Owed amount must be greater than or equal to $0.00.");
    }

    [Fact]
    public void Validate_ZeroOwedAmount_IsValid()
    {
        var input = new TransactionInput(0, 100);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveValidationErrorFor(x => x.OwedAmountInCents);
    }

    // --- Paid amount must be > 0 ---

    [Fact]
    public void Validate_ZeroPaidAmount_HasError()
    {
        var input = new TransactionInput(0, 0);

        var result = _sut.TestValidate(input);

        result.ShouldHaveValidationErrorFor(x => x.PaidAmountInCents)
            .WithErrorMessage("Paid amount must be greater than $0.00.");
    }

    [Fact]
    public void Validate_NegativePaidAmount_HasError()
    {
        var input = new TransactionInput(0, -50);

        var result = _sut.TestValidate(input);

        result.ShouldHaveValidationErrorFor(x => x.PaidAmountInCents);
    }

    [Fact]
    public void Validate_OneCentPaid_IsValid()
    {
        var input = new TransactionInput(0, 1);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveValidationErrorFor(x => x.PaidAmountInCents);
    }

    // --- Paid must be >= owed ---

    [Fact]
    public void Validate_PaidLessThanOwed_HasError()
    {
        var input = new TransactionInput(500, 300);

        var result = _sut.TestValidate(input);

        result.ShouldHaveValidationErrorFor(x => x.PaidAmountInCents)
            .WithErrorMessage("Paid amount must be greater than or equal to the owed amount.");
    }

    [Fact]
    public void Validate_PaidEqualsOwed_IsValid()
    {
        var input = new TransactionInput(250, 250);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_PaidGreaterThanOwed_IsValid()
    {
        var input = new TransactionInput(100, 500);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveAnyValidationErrors();
    }

    // --- Multiple errors ---

    [Fact]
    public void Validate_NegativeOwedAndZeroPaid_HasMultipleErrors()
    {
        var input = new TransactionInput(-100, 0);

        var result = _sut.TestValidate(input);

        result.ShouldHaveValidationErrorFor(x => x.OwedAmountInCents);
        result.ShouldHaveValidationErrorFor(x => x.PaidAmountInCents);
    }

    // --- Boundary cases ---

    [Fact]
    public void Validate_LargeValidAmounts_IsValid()
    {
        var input = new TransactionInput(999999, 1000000);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_MinimumValidTransaction_IsValid()
    {
        // Smallest valid: owed 0, paid 1
        var input = new TransactionInput(0, 1);

        var result = _sut.TestValidate(input);

        result.ShouldNotHaveAnyValidationErrors();
    }
}
