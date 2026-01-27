class Program
{

  static void Main()
  {
    // Inputs
    string sourceFile = "transactions.csv";
    string destinationFile = "output.txt";
    string denominationsFile = "denomination.csv";
    string divisorFile = "divisor.txt";

    try
    {

      // Get Data
      int divisor = int.Parse(File.ReadAllText(divisorFile));

      var transactions = GetFileData(sourceFile, divisor);

      var denominations = GetDenominations(denominationsFile);

      // Parse Data
      var results = ParseTransaction(denominations, transactions);

      // Write results
      WriteFileData(destinationFile, results);

    }
    catch (Exception ex)
    {
      System.Console.WriteLine("Error: ", ex);
    }

  }

  private static List<string> ParseTransaction(List<Denomination> denominations, List<Transaction> transactions)
  {
    var parsedTransactions = new List<string>();

    foreach (var transaction in transactions)
    {
      try
      {
        // Per Transaction Rules can be applied here

        parsedTransactions.Add(
          GetChange(denominations, transaction.amountOwed, transaction.amountPaid, transaction.divisibleByInput)
        );

      }
      catch (Exception)
      {
        // skip invalid transactions; no requirements specified;       
      }
    }

    return parsedTransactions;
  }


  #region File Operations


  private static List<Transaction> GetFileData(string sourceFile, int divisor)
  {
    if (File.Exists(sourceFile) == false)
    {
      throw new FileNotFoundException("Source file not found", sourceFile);
    }

    // File Format: Amount Owed, Amount Paid
    return File.ReadLines(sourceFile)
        .Select(line =>
        {
          var parts = line.Split(',');

          return new Transaction
          {
            amountOwed = decimal.Parse(parts[0]),
            amountPaid = decimal.Parse(parts[1]),
            divisibleByInput = (int)(decimal.Parse(parts[0]) * 100) % divisor == 0
          };
        })
    .ToList();
  }

  private static void WriteFileData(string destinationFile, List<string> results)
  {
    File.WriteAllLines(destinationFile, results);
  }

  /// <summary>
  /// Gets the List of currencies used
  /// </summary>
  /// <param name="sourceFile"></param>
  /// <returns></returns>
  /// <exception cref="FileNotFoundException"></exception>
  private static List<Denomination> GetDenominations(string sourceFile)
  {
    if (File.Exists(sourceFile) == false)
    {
      throw new FileNotFoundException("Source file not found", sourceFile);
    }

    // File Format: decimal value, name of denomination, plural name of denomination
    return File.ReadLines(sourceFile)
                         .Select(line =>
                         {
                           var parts = line.Split(',');

                           return new Denomination
                           {
                             value = decimal.Parse(parts[0]),
                             name = parts[1],
                             namePlural = parts[2]
                           };
                         })
    .ToList();
  }

  #endregion

  #region Calculations

  private static decimal CalculateChange(decimal amountOwed, decimal amountPaid)
  {
    return amountPaid - amountOwed;
  }

  private static string GetChange(List<Denomination> denominations, decimal amountOwed, decimal amountPaid, bool divisibleByThree)
  {
    var changeDue = CalculateChange(amountOwed, amountPaid);

    var result = new List<string>();

    var mostDenomination = denominations.OrderByDescending(d => d.value).FirstOrDefault();

    foreach (var denomination in denominations)
    {
      var count = Math.Floor(changeDue / denomination.value);

      // Special Rule per Demoniation here

      if (divisibleByThree && denomination.value > 0.01M)
      {
        count = GetRandonIntPerDenomination(mostDenomination.value, count);
      }

      if (count > 0)
      {
        result.Add(@$"{count} {(count > 1 ? denomination.namePlural : denomination.name)}");
        changeDue -= count * denomination.value;
      }
    }

    return string.Join(",", result);
  }

  /// <summary>
  /// Used the max count in the specific denomination to get a random integer between 0 and that count
  /// </summary>
  /// <param name="maxBound"></param>
  /// <param name="count"></param>
  /// <returns></returns>
  private static int GetRandonIntPerDenomination(decimal maxBound, decimal count)
  {
    var random = new Random();
    int upperBound = Math.Min((int)maxBound, (int)count);
    int lowerBound = 0;
    return random.Next(lowerBound, upperBound + 1);
  }

  #endregion

  #region Classes

  public class Transaction
  {
    public decimal amountOwed { get; set; } = 0.00M;
    public decimal amountPaid { get; set; } = 0.00M;

    public bool divisibleByInput { get; set; } = false;
  }

  public class Denomination
  {
    public decimal value { get; set; } = 0.00M;
    public string name { get; set; } = default!;
    public string namePlural { get; set; } = default!;
  }

  #endregion

}