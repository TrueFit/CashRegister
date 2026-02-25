using System.Globalization;
using CashRegister.Core.Models;

namespace CashRegister.Core.Services;

/// <summary>
/// Default implementation of <see cref="IFileParserService"/>.
/// </summary>
public class FileParserService : IFileParserService
{
    /// <inheritdoc />
    public IEnumerable<TransactionInput> Parse(Stream fileStream)
    {
        ArgumentNullException.ThrowIfNull(fileStream);

        return ParseLines(fileStream);
    }

    // Separated from Parse() so the null check runs eagerly before any iteration.
    private static IEnumerable<TransactionInput> ParseLines(Stream fileStream)
    {
        using var reader = new StreamReader(fileStream, leaveOpen: true);

        var lineNumber = 0;
        while (reader.ReadLine() is { } rawLine)
        {
            lineNumber++;
            var line = rawLine.Trim();

            // Skip empty / whitespace-only lines.
            if (string.IsNullOrEmpty(line))
                continue;

            var parts = line.Split(',');

            if (parts.Length != 2)
                throw new FormatException(
                    $"Line {lineNumber}: Expected format 'owed,paid' but found {parts.Length} value(s). Input: \"{rawLine}\"");

            if (!decimal.TryParse(parts[0].Trim(), NumberStyles.Number, CultureInfo.InvariantCulture, out var owed))
                throw new FormatException(
                    $"Line {lineNumber}: Cannot parse owed amount '{parts[0].Trim()}' as a decimal number.");

            if (!decimal.TryParse(parts[1].Trim(), NumberStyles.Number, CultureInfo.InvariantCulture, out var paid))
                throw new FormatException(
                    $"Line {lineNumber}: Cannot parse paid amount '{parts[1].Trim()}' as a decimal number.");

            // Convert to cents immediately.
            var owedInCents = (int)Math.Round(owed * 100m, MidpointRounding.ToEven);
            var paidInCents = (int)Math.Round(paid * 100m, MidpointRounding.ToEven);

            yield return new TransactionInput(owedInCents, paidInCents);
        }
    }
}
