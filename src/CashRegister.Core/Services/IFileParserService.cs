using CashRegister.Core.Models;

namespace CashRegister.Core.Services;

/// <summary>
/// Parses a flat file of cash register transactions.
/// </summary>
/// <remarks>
/// Each line in the file is expected to contain a comma-separated pair:
/// <c>amountOwed,amountPaid</c> (e.g., "2.13,3.00").
/// </remarks>
public interface IFileParserService
{
    /// <summary>
    /// Parses a stream of transaction data and returns the parsed transactions.
    /// </summary>
    /// <param name="fileStream">
    /// A readable stream containing the transaction file content.
    /// Each line should be in the format "owed,paid" (e.g., "2.13,3.00").
    /// </param>
    /// <returns>
    /// An enumerable of <see cref="TransactionInput"/> records, one per valid line.
    /// Empty lines and whitespace-only lines are skipped.
    /// </returns>
    /// <exception cref="FormatException">
    /// Thrown when a non-empty line cannot be parsed (invalid format, non-numeric values, etc.).
    /// </exception>
    IEnumerable<TransactionInput> Parse(Stream fileStream);
}
