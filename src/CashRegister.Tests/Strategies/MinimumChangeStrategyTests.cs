using CashRegister.Core.Models;
using CashRegister.Core.Strategies;
using FluentAssertions;

namespace CashRegister.Tests.Strategies;

public class MinimumChangeStrategyTests
{
    private readonly MinimumChangeStrategy _sut = new();
    private readonly IReadOnlyList<Denomination> _usdDenominations = Currency.USD().Denominations;
    private readonly IReadOnlyList<Denomination> _eurDenominations = Currency.EUR().Denominations;

    // --- USD denomination helpers ---
    private static Denomination Dollar => new("dollar", 100);
    private static Denomination Quarter => new("quarter", 25);
    private static Denomination Dime => new("dime", 10);
    private static Denomination Nickel => new("nickel", 5);
    private static Denomination Penny => new("penny", 1);

    // --- EUR denomination helpers ---
    private static Denomination TwoEuro => new("2 euro", 200);
    private static Denomination OneEuro => new("1 euro", 100);
    private static Denomination FiftyCent => new("50 cent", 50);
    private static Denomination TwentyCent => new("20 cent", 20);
    private static Denomination TenCent => new("10 cent", 10);
    private static Denomination FiveCent => new("5 cent", 5);
    private static Denomination TwoCent => new("2 cent", 2);
    private static Denomination OneCent => new("1 cent", 1);

    [Fact]
    public void Calculate_88Cents_Returns3Quarters1Dime3Pennies()
    {
        var result = _sut.Calculate(88, _usdDenominations);

        result[Dollar].Should().Be(0);
        result[Quarter].Should().Be(3);
        result[Dime].Should().Be(1);
        result[Nickel].Should().Be(0);
        result[Penny].Should().Be(3);
    }

    [Fact]
    public void Calculate_3Cents_Returns3Pennies()
    {
        var result = _sut.Calculate(3, _usdDenominations);

        result[Dollar].Should().Be(0);
        result[Quarter].Should().Be(0);
        result[Dime].Should().Be(0);
        result[Nickel].Should().Be(0);
        result[Penny].Should().Be(3);
    }

    [Fact]
    public void Calculate_167Cents_Returns1Dollar2Quarters1Dime1Nickel2Pennies()
    {
        var result = _sut.Calculate(167, _usdDenominations);

        result[Dollar].Should().Be(1);
        result[Quarter].Should().Be(2);
        result[Dime].Should().Be(1);
        result[Nickel].Should().Be(1);
        result[Penny].Should().Be(2);
    }

    [Fact]
    public void Calculate_ZeroCents_ReturnsAllZeroCounts()
    {
        var result = _sut.Calculate(0, _usdDenominations);

        result.Values.Should().AllBeEquivalentTo(0);
    }

    [Fact]
    public void Calculate_100Cents_Returns1Dollar()
    {
        var result = _sut.Calculate(100, _usdDenominations);

        result[Dollar].Should().Be(1);
        result[Quarter].Should().Be(0);
        result[Dime].Should().Be(0);
        result[Nickel].Should().Be(0);
        result[Penny].Should().Be(0);
    }

    [Fact]
    public void Calculate_25Cents_Returns1Quarter()
    {
        var result = _sut.Calculate(25, _usdDenominations);

        result[Dollar].Should().Be(0);
        result[Quarter].Should().Be(1);
        result[Dime].Should().Be(0);
        result[Nickel].Should().Be(0);
        result[Penny].Should().Be(0);
    }

    [Fact]
    public void Calculate_999Cents_ReturnsCorrectLargeBreakdown()
    {
        // 999 = 9*100 + 3*25 + 2*10 + 0*5 + 4*1
        var result = _sut.Calculate(999, _usdDenominations);

        result[Dollar].Should().Be(9);
        result[Quarter].Should().Be(3);
        result[Dime].Should().Be(2);
        result[Nickel].Should().Be(0);
        result[Penny].Should().Be(4);
    }

    [Theory]
    [InlineData(1, 0, 0, 0, 1)]
    [InlineData(5, 0, 0, 1, 0)]
    [InlineData(10, 0, 1, 0, 0)]
    [InlineData(30, 1, 0, 1, 0)]
    [InlineData(41, 1, 1, 1, 1)]
    [InlineData(99, 3, 2, 0, 4)]
    public void Calculate_VariousUsdAmounts_ReturnsCorrectBreakdown(
        int amountInCents,
        int expectedQuarters,
        int expectedDimes,
        int expectedNickels,
        int expectedPennies)
    {
        var result = _sut.Calculate(amountInCents, _usdDenominations);

        result[Quarter].Should().Be(expectedQuarters);
        result[Dime].Should().Be(expectedDimes);
        result[Nickel].Should().Be(expectedNickels);
        result[Penny].Should().Be(expectedPennies);
    }

    [Fact]
    public void Calculate_BreakdownSumsToOriginalAmount()
    {
        var result = _sut.Calculate(167, _usdDenominations);

        var total = result.Sum(kvp => kvp.Key.ValueInCents * kvp.Value);
        total.Should().Be(167);
    }

    [Fact]
    public void Calculate_AllDenominationsPresent_InBreakdown()
    {
        var result = _sut.Calculate(88, _usdDenominations);

        result.Should().HaveCount(_usdDenominations.Count);
    }

    // --- EUR tests ---

    [Fact]
    public void Calculate_EUR_350Cents_Returns1TwoEuro1Euro1FiftyCent()
    {
        var result = _sut.Calculate(350, _eurDenominations);

        result[TwoEuro].Should().Be(1);
        result[OneEuro].Should().Be(1);
        result[FiftyCent].Should().Be(1);
        result[TwentyCent].Should().Be(0);
        result[TenCent].Should().Be(0);
        result[FiveCent].Should().Be(0);
        result[TwoCent].Should().Be(0);
        result[OneCent].Should().Be(0);
    }

    [Fact]
    public void Calculate_EUR_99Cents_ReturnsCorrectBreakdown()
    {
        // 99 = 0*200 + 0*100 + 1*50 + 2*20 + 0*10 + 1*5 + 2*2 + 0*1
        var result = _sut.Calculate(99, _eurDenominations);

        result[TwoEuro].Should().Be(0);
        result[OneEuro].Should().Be(0);
        result[FiftyCent].Should().Be(1);
        result[TwentyCent].Should().Be(2);
        result[TenCent].Should().Be(0);
        result[FiveCent].Should().Be(1);
        result[TwoCent].Should().Be(2);
        result[OneCent].Should().Be(0);
    }

    [Fact]
    public void Calculate_EUR_1Cent_Returns1OneCent()
    {
        var result = _sut.Calculate(1, _eurDenominations);

        result[OneCent].Should().Be(1);
        result.Where(kvp => kvp.Key != OneCent).Should().AllSatisfy(kvp => kvp.Value.Should().Be(0));
    }

    [Fact]
    public void Calculate_EUR_BreakdownSumsToOriginalAmount()
    {
        var result = _sut.Calculate(387, _eurDenominations);

        var total = result.Sum(kvp => kvp.Key.ValueInCents * kvp.Value);
        total.Should().Be(387);
    }
}
