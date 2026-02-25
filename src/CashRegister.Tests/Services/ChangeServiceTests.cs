using CashRegister.Core.Configuration;
using CashRegister.Core.Models;
using CashRegister.Core.Rules;
using CashRegister.Core.Services;
using CashRegister.Core.Strategies;
using FluentAssertions;
using Moq;

namespace CashRegister.Tests.Services;

public class ChangeServiceTests
{
    private static Denomination Dollar => new("dollar", 100);
    private static Denomination Quarter => new("quarter", 25);
    private static Denomination Dime => new("dime", 10);
    private static Denomination Nickel => new("nickel", 5);
    private static Denomination Penny => new("penny", 1);

    private readonly MinimumChangeStrategy _defaultStrategy = new();

    private ChangeService CreateService(
        IEnumerable<IChangeRule>? rules = null,
        string currencyCode = "USD",
        int randomDivisor = 3)
    {
        var settings = new CashRegisterSettings
        {
            CurrencyCode = currencyCode,
            RandomDivisor = randomDivisor
        };

        var registry = new CurrencyRegistry();

        return new ChangeService(
            rules ?? Enumerable.Empty<IChangeRule>(),
            _defaultStrategy,
            registry,
            settings);
    }

    // --- Correct change amount ---

    [Theory]
    [InlineData(2.12, 3.00, 88)]
    [InlineData(1.97, 2.00, 3)]
    [InlineData(1.00, 1.00, 0)]
    [InlineData(0.01, 1.00, 99)]
    [InlineData(2.50, 5.00, 250)]
    public void CalculateChange_VariousAmounts_ReturnsCorrectChangeInCents(
        decimal owed, decimal paid, int expectedChangeInCents)
    {
        var sut = CreateService();

        var result = sut.CalculateChange(owed, paid);

        result.ChangeAmountInCents.Should().Be(expectedChangeInCents);
    }

    [Fact]
    public void CalculateChange_SampleInput_ReturnsCorrectBreakdown()
    {
        // Sample: 2.12 owed, 3.00 paid → 88 cents → 3 quarters, 1 dime, 3 pennies
        var sut = CreateService();

        var result = sut.CalculateChange(2.12m, 3.00m);

        result.Breakdown[Quarter].Should().Be(3);
        result.Breakdown[Dime].Should().Be(1);
        result.Breakdown[Penny].Should().Be(3);
        result.IsRandom.Should().BeFalse();
    }

    [Fact]
    public void CalculateChange_3CentsChange_Returns3Pennies()
    {
        // Sample: 1.97 owed, 2.00 paid → 3 cents → 3 pennies
        var sut = CreateService();

        var result = sut.CalculateChange(1.97m, 2.00m);

        result.Breakdown[Penny].Should().Be(3);
        result.ChangeAmountInCents.Should().Be(3);
    }

    // --- Default strategy (no rules) ---

    [Fact]
    public void CalculateChange_NoRules_UsesMinimumStrategy()
    {
        var sut = CreateService();

        var result = sut.CalculateChange(2.12m, 3.00m);

        result.IsRandom.Should().BeFalse();
        // Minimum strategy should produce 3 quarters, 1 dime, 3 pennies
        result.Breakdown[Dollar].Should().Be(0);
        result.Breakdown[Quarter].Should().Be(3);
        result.Breakdown[Dime].Should().Be(1);
        result.Breakdown[Nickel].Should().Be(0);
        result.Breakdown[Penny].Should().Be(3);
    }

    // --- Rule applies (divisible by 3) ---

    [Fact]
    public void CalculateChange_OwedDivisibleBy3_UsesRandomStrategy()
    {
        // 3.33 = 333 cents, 333 % 3 == 0 → random
        var randomStrategy = new RandomChangeStrategy(new Random(42));
        var ruleSettings = new CashRegisterSettings { RandomDivisor = 3 };
        var rule = new DivisibleByRule(ruleSettings, randomStrategy);
        var sut = CreateService(rules: new[] { rule });

        var result = sut.CalculateChange(3.33m, 5.00m);

        result.IsRandom.Should().BeTrue();
        // Change is 167 cents, verify it sums correctly regardless of distribution
        var total = result.Breakdown.Sum(kvp => kvp.Key.ValueInCents * kvp.Value);
        total.Should().Be(167);
    }

    [Fact]
    public void CalculateChange_OwedNotDivisibleBy3_UsesMinimumStrategy()
    {
        var randomStrategy = new RandomChangeStrategy(new Random(42));
        var ruleSettings = new CashRegisterSettings { RandomDivisor = 3 };
        var rule = new DivisibleByRule(ruleSettings, randomStrategy);
        var sut = CreateService(rules: new[] { rule });

        var result = sut.CalculateChange(2.12m, 3.00m);

        result.IsRandom.Should().BeFalse();
    }

    // --- Error cases ---

    [Fact]
    public void CalculateChange_PaidLessThanOwed_ThrowsArgumentException()
    {
        var sut = CreateService();

        var act = () => sut.CalculateChange(5.00m, 3.00m);

        act.Should().Throw<ArgumentException>()
            .WithParameterName("paid");
    }

    // --- Zero change ---

    [Fact]
    public void CalculateChange_PaidEqualsOwed_ReturnsZeroChange()
    {
        var sut = CreateService();

        var result = sut.CalculateChange(2.50m, 2.50m);

        result.ChangeAmountInCents.Should().Be(0);
        result.Breakdown.Values.Should().AllBeEquivalentTo(0);
    }

    // --- Amounts stored correctly ---

    [Fact]
    public void CalculateChange_SetsOwedAndPaidAmountsCorrectly()
    {
        var sut = CreateService();

        var result = sut.CalculateChange(2.12m, 3.00m);

        result.OwedAmountInCents.Should().Be(212);
        result.PaidAmountInCents.Should().Be(300);
        result.OwedAmount.Should().Be(2.12m);
        result.PaidAmount.Should().Be(3.00m);
    }

    // --- First matching rule wins ---

    [Fact]
    public void CalculateChange_MultipleRules_FirstMatchingRuleWins()
    {
        var mockRule1 = new Mock<IChangeRule>();
        mockRule1.Setup(r => r.Applies(It.IsAny<int>())).Returns(true);
        mockRule1.Setup(r => r.GetStrategy()).Returns(new MinimumChangeStrategy());

        var mockRule2 = new Mock<IChangeRule>();
        mockRule2.Setup(r => r.Applies(It.IsAny<int>())).Returns(true);
        mockRule2.Setup(r => r.GetStrategy()).Returns(new RandomChangeStrategy(new Random(42)));

        var sut = CreateService(rules: new[] { mockRule1.Object, mockRule2.Object });
        sut.CalculateChange(2.12m, 3.00m);

        // First rule was used; second rule's GetStrategy should never be called
        mockRule1.Verify(r => r.GetStrategy(), Times.Once);
        mockRule2.Verify(r => r.GetStrategy(), Times.Never);
    }

    // --- EUR currency ---

    [Fact]
    public void CalculateChange_EurCurrency_UsesEurDenominations()
    {
        var sut = CreateService(currencyCode: "EUR");

        var result = sut.CalculateChange(1.50m, 5.00m);

        // 350 cents in EUR = 1x 2 euro + 1x 1 euro + 1x 50 cent
        var twoEuro = new Denomination("2 euro", 200);
        var oneEuro = new Denomination("1 euro", 100);
        var fiftyCent = new Denomination("50 cent", 50);

        result.Breakdown[twoEuro].Should().Be(1);
        result.Breakdown[oneEuro].Should().Be(1);
        result.Breakdown[fiftyCent].Should().Be(1);
    }
}
