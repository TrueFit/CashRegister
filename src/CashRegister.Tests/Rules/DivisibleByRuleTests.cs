using CashRegister.Core.Configuration;
using CashRegister.Core.Rules;
using CashRegister.Core.Strategies;
using FluentAssertions;

namespace CashRegister.Tests.Rules;

public class DivisibleByRuleTests
{
    private readonly RandomChangeStrategy _strategy = new(new Random(42));

    // --- Divisible by 3 ---

    [Theory]
    [InlineData(333, true)]   // $3.33 → 333 % 3 == 0
    [InlineData(300, true)]   // $3.00 → 300 % 3 == 0
    [InlineData(3, true)]     // $0.03 → 3 % 3 == 0
    [InlineData(6, true)]     // $0.06 → 6 % 3 == 0
    [InlineData(999, true)]   // $9.99 → 999 % 3 == 0
    [InlineData(212, false)]  // $2.12 → 212 % 3 != 0
    [InlineData(197, false)]  // $1.97 → 197 % 3 != 0
    [InlineData(100, false)]  // $1.00 → 100 % 3 != 0
    [InlineData(1, false)]    // $0.01 → 1 % 3 != 0
    public void Applies_Divisor3_ReturnsExpectedResult(int owedInCents, bool expected)
    {
        var settings = new CashRegisterSettings { RandomDivisor = 3 };
        var sut = new DivisibleByRule(settings, _strategy);

        sut.Applies(owedInCents).Should().Be(expected);
    }

    // --- Zero owed ---

    [Fact]
    public void Applies_ZeroCents_ReturnsTrue()
    {
        // 0 % 3 == 0
        var settings = new CashRegisterSettings { RandomDivisor = 3 };
        var sut = new DivisibleByRule(settings, _strategy);

        sut.Applies(0).Should().BeTrue();
    }

    // --- Divisible by 5 ---

    [Theory]
    [InlineData(500, true)]
    [InlineData(250, true)]
    [InlineData(5, true)]
    [InlineData(333, false)]
    [InlineData(212, false)]
    public void Applies_Divisor5_ReturnsExpectedResult(int owedInCents, bool expected)
    {
        var settings = new CashRegisterSettings { RandomDivisor = 5 };
        var sut = new DivisibleByRule(settings, _strategy);

        sut.Applies(owedInCents).Should().Be(expected);
    }

    // --- Divisible by 7 ---

    [Theory]
    [InlineData(700, true)]
    [InlineData(7, true)]
    [InlineData(49, true)]
    [InlineData(100, false)]
    [InlineData(333, false)]
    public void Applies_Divisor7_ReturnsExpectedResult(int owedInCents, bool expected)
    {
        var settings = new CashRegisterSettings { RandomDivisor = 7 };
        var sut = new DivisibleByRule(settings, _strategy);

        sut.Applies(owedInCents).Should().Be(expected);
    }

    // --- GetStrategy returns the injected strategy ---

    [Fact]
    public void GetStrategy_ReturnsInjectedRandomStrategy()
    {
        var settings = new CashRegisterSettings { RandomDivisor = 3 };
        var sut = new DivisibleByRule(settings, _strategy);

        sut.GetStrategy().Should().BeSameAs(_strategy);
    }

    // --- Divisor changes at runtime ---

    [Fact]
    public void Applies_DivisorChangesAtRuntime_UsesUpdatedValue()
    {
        var settings = new CashRegisterSettings { RandomDivisor = 3 };
        var sut = new DivisibleByRule(settings, _strategy);

        // Initially divisor is 3: 9 % 3 == 0
        sut.Applies(9).Should().BeTrue();

        // Change divisor to 5 at runtime: 9 % 5 != 0
        settings.RandomDivisor = 5;
        sut.Applies(9).Should().BeFalse();

        // 10 % 5 == 0
        sut.Applies(10).Should().BeTrue();
    }

    // --- Constructor validation ---

    [Fact]
    public void Constructor_NullSettings_ThrowsArgumentNullException()
    {
        var act = () => new DivisibleByRule(null!, _strategy);

        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("settings");
    }

    [Fact]
    public void Constructor_NullStrategy_ThrowsArgumentNullException()
    {
        var settings = new CashRegisterSettings { RandomDivisor = 3 };
        var act = () => new DivisibleByRule(settings, null!);

        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("strategy");
    }
}
