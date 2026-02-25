using CashRegister.Core.Models;
using CashRegister.Core.Strategies;
using FluentAssertions;

namespace CashRegister.Tests.Strategies;

public class RandomChangeStrategyTests
{
    private readonly IReadOnlyList<Denomination> _usdDenominations = Currency.USD().Denominations;
    private readonly IReadOnlyList<Denomination> _eurDenominations = Currency.EUR().Denominations;

    [Theory]
    [InlineData(1)]
    [InlineData(50)]
    [InlineData(88)]
    [InlineData(167)]
    [InlineData(500)]
    [InlineData(999)]
    public void Calculate_VariousAmounts_AlwaysSumsToCorrectTotal(int amountInCents)
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(amountInCents, _usdDenominations);

        var total = result.Sum(kvp => kvp.Key.ValueInCents * kvp.Value);
        total.Should().Be(amountInCents);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(50)]
    [InlineData(88)]
    [InlineData(167)]
    [InlineData(500)]
    public void Calculate_VariousAmounts_AllCountsAreNonNegative(int amountInCents)
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(amountInCents, _usdDenominations);

        result.Values.Should().AllSatisfy(count => count.Should().BeGreaterThanOrEqualTo(0));
    }

    [Fact]
    public void Calculate_ZeroCents_ReturnsAllZeroCounts()
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(0, _usdDenominations);

        result.Values.Should().AllBeEquivalentTo(0);
    }

    [Fact]
    public void Calculate_1Cent_Returns1Penny()
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(1, _usdDenominations);

        var penny = new Denomination("penny", 1);
        result[penny].Should().Be(1);
    }

    [Fact]
    public void Calculate_IncludesAllDenominations()
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(167, _usdDenominations);

        result.Should().HaveCount(_usdDenominations.Count);
    }

    [Fact]
    public void Calculate_MultipleCallsSameAmount_CanProduceDifferentResults()
    {
        // Use different seeds to demonstrate non-determinism
        var sut1 = new RandomChangeStrategy(new Random(1));
        var sut2 = new RandomChangeStrategy(new Random(999));

        var result1 = sut1.Calculate(167, _usdDenominations);
        var result2 = sut2.Calculate(167, _usdDenominations);

        // Both must sum correctly
        result1.Sum(kvp => kvp.Key.ValueInCents * kvp.Value).Should().Be(167);
        result2.Sum(kvp => kvp.Key.ValueInCents * kvp.Value).Should().Be(167);

        // At least one denomination count should differ (very likely with different seeds)
        var areDifferent = result1.Any(kvp => result2[kvp.Key] != kvp.Value);
        areDifferent.Should().BeTrue("different seeds should produce different breakdowns");
    }

    [Fact]
    public void Calculate_WithSeededRandom_IsDeterministic()
    {
        var sut1 = new RandomChangeStrategy(new Random(42));
        var sut2 = new RandomChangeStrategy(new Random(42));

        var result1 = sut1.Calculate(167, _usdDenominations);
        var result2 = sut2.Calculate(167, _usdDenominations);

        result1.Should().BeEquivalentTo(result2);
    }

    [Fact]
    public void Calculate_RepeatedRuns_AllSumCorrectly()
    {
        // Run many iterations to increase confidence the sum is always correct
        for (var seed = 0; seed < 50; seed++)
        {
            var sut = new RandomChangeStrategy(new Random(seed));
            var result = sut.Calculate(88, _usdDenominations);

            var total = result.Sum(kvp => kvp.Key.ValueInCents * kvp.Value);
            total.Should().Be(88, $"seed {seed} should produce a valid sum");
        }
    }

    // --- EUR tests ---

    [Theory]
    [InlineData(1)]
    [InlineData(99)]
    [InlineData(350)]
    [InlineData(587)]
    public void Calculate_EUR_VariousAmounts_AlwaysSumsToCorrectTotal(int amountInCents)
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(amountInCents, _eurDenominations);

        var total = result.Sum(kvp => kvp.Key.ValueInCents * kvp.Value);
        total.Should().Be(amountInCents);
    }

    [Fact]
    public void Calculate_EUR_AllCountsAreNonNegative()
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(387, _eurDenominations);

        result.Values.Should().AllSatisfy(count => count.Should().BeGreaterThanOrEqualTo(0));
    }

    [Fact]
    public void Calculate_EUR_IncludesAllDenominations()
    {
        var sut = new RandomChangeStrategy(new Random(42));

        var result = sut.Calculate(387, _eurDenominations);

        result.Should().HaveCount(_eurDenominations.Count);
    }

    [Fact]
    public void Calculate_DefaultConstructor_DoesNotThrow()
    {
        var sut = new RandomChangeStrategy();

        var act = () => sut.Calculate(88, _usdDenominations);

        act.Should().NotThrow();
    }

    [Fact]
    public void Constructor_NullRandom_ThrowsArgumentNullException()
    {
        var act = () => new RandomChangeStrategy(null!);

        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("random");
    }
}
