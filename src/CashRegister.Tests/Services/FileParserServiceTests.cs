using System.Text;
using CashRegister.Core.Models;
using CashRegister.Core.Services;
using FluentAssertions;

namespace CashRegister.Tests.Services;

public class FileParserServiceTests
{
    private readonly FileParserService _sut = new();

    private static Stream ToStream(string content) =>
        new MemoryStream(Encoding.UTF8.GetBytes(content));

    // --- Single line ---

    [Fact]
    public void Parse_SingleLine_ReturnsOneTransaction()
    {
        using var stream = ToStream("2.12,3.00");

        var results = _sut.Parse(stream).ToList();

        results.Should().HaveCount(1);
        results[0].OwedAmountInCents.Should().Be(212);
        results[0].PaidAmountInCents.Should().Be(300);
    }

    // --- Multiple lines ---

    [Fact]
    public void Parse_MultipleLines_ReturnsAllTransactions()
    {
        using var stream = ToStream("2.12,3.00\n1.97,2.00\n3.33,5.00");

        var results = _sut.Parse(stream).ToList();

        results.Should().HaveCount(3);
        results[0].OwedAmountInCents.Should().Be(212);
        results[0].PaidAmountInCents.Should().Be(300);
        results[1].OwedAmountInCents.Should().Be(197);
        results[1].PaidAmountInCents.Should().Be(200);
        results[2].OwedAmountInCents.Should().Be(333);
        results[2].PaidAmountInCents.Should().Be(500);
    }

    // --- Empty lines ---

    [Fact]
    public void Parse_EmptyLinesBetweenData_SkipsEmptyLines()
    {
        using var stream = ToStream("2.12,3.00\n\n1.97,2.00\n\n");

        var results = _sut.Parse(stream).ToList();

        results.Should().HaveCount(2);
    }

    [Fact]
    public void Parse_AllEmptyLines_ReturnsEmpty()
    {
        using var stream = ToStream("\n\n\n");

        var results = _sut.Parse(stream).ToList();

        results.Should().BeEmpty();
    }

    [Fact]
    public void Parse_EmptyFile_ReturnsEmpty()
    {
        using var stream = ToStream("");

        var results = _sut.Parse(stream).ToList();

        results.Should().BeEmpty();
    }

    // --- Whitespace handling ---

    [Fact]
    public void Parse_WhitespaceAroundValues_TrimsAndParsesCorrectly()
    {
        using var stream = ToStream("  2.12 , 3.00  ");

        var results = _sut.Parse(stream).ToList();

        results.Should().HaveCount(1);
        results[0].OwedAmountInCents.Should().Be(212);
        results[0].PaidAmountInCents.Should().Be(300);
    }

    [Fact]
    public void Parse_WhitespaceOnlyLine_SkipsLine()
    {
        using var stream = ToStream("   \n2.12,3.00\n   ");

        var results = _sut.Parse(stream).ToList();

        results.Should().HaveCount(1);
    }

    // --- Invalid input ---

    [Fact]
    public void Parse_LettersInOwedAmount_ThrowsFormatException()
    {
        using var stream = ToStream("abc,3.00");

        var act = () => _sut.Parse(stream).ToList();

        act.Should().Throw<FormatException>()
            .WithMessage("*Cannot parse owed amount*");
    }

    [Fact]
    public void Parse_LettersInPaidAmount_ThrowsFormatException()
    {
        using var stream = ToStream("2.12,xyz");

        var act = () => _sut.Parse(stream).ToList();

        act.Should().Throw<FormatException>()
            .WithMessage("*Cannot parse paid amount*");
    }

    [Fact]
    public void Parse_MissingComma_ThrowsFormatException()
    {
        using var stream = ToStream("2.12 3.00");

        var act = () => _sut.Parse(stream).ToList();

        act.Should().Throw<FormatException>()
            .WithMessage("*Expected format*");
    }

    [Fact]
    public void Parse_TooManyCommas_ThrowsFormatException()
    {
        using var stream = ToStream("2.12,3.00,4.00");

        var act = () => _sut.Parse(stream).ToList();

        act.Should().Throw<FormatException>()
            .WithMessage("*Expected format*3 value(s)*");
    }

    [Fact]
    public void Parse_SingleValueNoComma_ThrowsFormatException()
    {
        using var stream = ToStream("2.12");

        var act = () => _sut.Parse(stream).ToList();

        act.Should().Throw<FormatException>()
            .WithMessage("*Expected format*1 value(s)*");
    }

    [Fact]
    public void Parse_NullStream_ThrowsArgumentNullException()
    {
        var act = () => _sut.Parse(null!);

        act.Should().Throw<ArgumentNullException>();
    }

    // --- Error message includes line number ---

    [Fact]
    public void Parse_InvalidLineOnLine3_ErrorMessageIncludesLineNumber()
    {
        using var stream = ToStream("2.12,3.00\n1.97,2.00\nbadline");

        var act = () => _sut.Parse(stream).ToList();

        act.Should().Throw<FormatException>()
            .WithMessage("Line 3:*");
    }

    // --- Decimal precision ---

    [Fact]
    public void Parse_WholeNumbers_ParsesCorrectly()
    {
        using var stream = ToStream("2,3");

        var results = _sut.Parse(stream).ToList();

        results[0].OwedAmountInCents.Should().Be(200);
        results[0].PaidAmountInCents.Should().Be(300);
    }

    [Fact]
    public void Parse_SingleDecimalPlace_ParsesCorrectly()
    {
        using var stream = ToStream("2.1,3.5");

        var results = _sut.Parse(stream).ToList();

        results[0].OwedAmountInCents.Should().Be(210);
        results[0].PaidAmountInCents.Should().Be(350);
    }
}
