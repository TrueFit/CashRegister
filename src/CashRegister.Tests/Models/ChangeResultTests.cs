using CashRegister.Core.Models;
using FluentAssertions;

namespace CashRegister.Tests.Models;

public class ChangeResultTests
{
    private static Denomination Dollar => new("dollar", 100);
    private static Denomination Quarter => new("quarter", 25);
    private static Denomination Dime => new("dime", 10);
    private static Denomination Nickel => new("nickel", 5);
    private static Denomination Penny => new("penny", 1);

    // --- ToFormattedString: sample output from README ---

    [Fact]
    public void ToFormattedString_SampleOutput_3Quarters1Dime3Pennies()
    {
        // README sample: 2.12 owed, 3.00 paid → "3 quarters,1 dime,3 pennies"
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 3 },
            { Dime, 1 },
            { Nickel, 0 },
            { Penny, 3 }
        };
        var sut = new ChangeResult(212, 300, breakdown, false);

        sut.ToFormattedString().Should().Be("3 quarters,1 dime,3 pennies");
    }

    [Fact]
    public void ToFormattedString_SampleOutput_3Pennies()
    {
        // README sample: 1.97 owed, 2.00 paid → "3 pennies"
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 3 }
        };
        var sut = new ChangeResult(197, 200, breakdown, false);

        sut.ToFormattedString().Should().Be("3 pennies");
    }

    // --- Singular vs plural ---

    [Fact]
    public void ToFormattedString_SinglePenny_UsesSingular()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 1 }
        };
        var sut = new ChangeResult(99, 100, breakdown, false);

        sut.ToFormattedString().Should().Be("1 penny");
    }

    [Fact]
    public void ToFormattedString_SingleDollar_UsesSingular()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 1 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(0, 100, breakdown, false);

        sut.ToFormattedString().Should().Be("1 dollar");
    }

    [Fact]
    public void ToFormattedString_MultipleDollars_UsesPlural()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 3 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(0, 300, breakdown, false);

        sut.ToFormattedString().Should().Be("3 dollars");
    }

    [Fact]
    public void ToFormattedString_SingleQuarter_UsesSingular()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 1 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(75, 100, breakdown, false);

        sut.ToFormattedString().Should().Be("1 quarter");
    }

    // --- Skips zero-count denominations ---

    [Fact]
    public void ToFormattedString_ZeroCountDenominations_AreOmitted()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 2 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 1 }
        };
        var sut = new ChangeResult(49, 100, breakdown, false);

        var result = sut.ToFormattedString();

        result.Should().Be("2 quarters,1 penny");
        result.Should().NotContain("dollar");
        result.Should().NotContain("dime");
        result.Should().NotContain("nickel");
    }

    [Fact]
    public void ToFormattedString_AllZeros_ReturnsEmptyString()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 0 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(100, 100, breakdown, false);

        sut.ToFormattedString().Should().BeEmpty();
    }

    // --- Correct order (highest to lowest) ---

    [Fact]
    public void ToFormattedString_MultipleNonZero_MaintainsDictionaryOrder()
    {
        // Dictionary preserves insertion order, and the strategies insert
        // denominations highest to lowest matching Currency definition order
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 1 },
            { Quarter, 2 },
            { Dime, 1 },
            { Nickel, 1 },
            { Penny, 2 }
        };
        var sut = new ChangeResult(12, 200, breakdown, false);

        sut.ToFormattedString().Should().Be("1 dollar,2 quarters,1 dime,1 nickel,2 pennies");
    }

    // --- ChangeResult property tests ---

    [Fact]
    public void Constructor_SetsChangeAmountCorrectly()
    {
        var breakdown = new Dictionary<Denomination, int> { { Penny, 88 } };
        var sut = new ChangeResult(212, 300, breakdown, false);

        sut.ChangeAmountInCents.Should().Be(88);
        sut.ChangeAmount.Should().Be(0.88m);
    }

    [Fact]
    public void Constructor_SetsDecimalAmountsCorrectly()
    {
        var breakdown = new Dictionary<Denomination, int> { { Penny, 1 } };
        var sut = new ChangeResult(212, 300, breakdown, false);

        sut.OwedAmount.Should().Be(2.12m);
        sut.PaidAmount.Should().Be(3.00m);
    }

    [Fact]
    public void Constructor_IsRandomTrue_SetsFlag()
    {
        var breakdown = new Dictionary<Denomination, int> { { Penny, 1 } };
        var sut = new ChangeResult(333, 500, breakdown, true);

        sut.IsRandom.Should().BeTrue();
    }

    [Fact]
    public void Constructor_IsRandomFalse_SetsFlag()
    {
        var breakdown = new Dictionary<Denomination, int> { { Penny, 1 } };
        var sut = new ChangeResult(212, 300, breakdown, false);

        sut.IsRandom.Should().BeFalse();
    }

    // --- Nickel plural ---

    [Fact]
    public void ToFormattedString_MultipleNickels_UsesPlural()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 6 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(70, 100, breakdown, false);

        sut.ToFormattedString().Should().Be("6 nickels");
    }

    [Fact]
    public void ToFormattedString_SingleNickel_UsesSingular()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 0 },
            { Quarter, 0 },
            { Dime, 0 },
            { Nickel, 1 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(95, 100, breakdown, false);

        sut.ToFormattedString().Should().Be("1 nickel");
    }

    // --- Mix of singular and plural ---

    [Fact]
    public void ToFormattedString_MixOfSingularAndPlural_FormatsCorrectly()
    {
        var breakdown = new Dictionary<Denomination, int>
        {
            { Dollar, 1 },
            { Quarter, 1 },
            { Dime, 0 },
            { Nickel, 1 },
            { Penny, 0 }
        };
        var sut = new ChangeResult(70, 200, breakdown, false);

        sut.ToFormattedString().Should().Be("1 dollar,1 quarter,1 nickel");
    }
}
