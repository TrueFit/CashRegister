using System.Globalization;
using cash_register_backend.DTOs;
using cash_register_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace cash_register_backend.Services
{
    public class CalculateService : ICalculateService
    {
        private readonly ILogger<CalculateService> _logger;
        private readonly IAppDbContext _context;

        public CalculateService(ILogger<CalculateService> logger, IAppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<List<string>?> CalculateChange(CalculateDTO calculateDTO)
        {
            if (calculateDTO?.InputFile == null || calculateDTO.InputFile.Length == 0)
            {
                return null;
            }

            await using var stream = calculateDTO.InputFile.OpenReadStream();
            var (isValid, errors, rows) = await ValidateCsvAsync(stream);
            stream.Close();

            if (!isValid)
            {
                return null;
            }

            var rules = await _context.Rules.Where(r => r.Enabled).ToListAsync();
            var setting = await _context.Settings.Include(s => s.Currency).ThenInclude(c => c.Denominations).FirstOrDefaultAsync();

            var results = new List<string>();
            foreach (var row in rows)
            {
                var result = CalculateRowChange(rules, setting, row);
                results.Add(result);
            }

            return results;
        }

        // validate the CSV file format and data, returning a list of errors if invalid, or the parsed rows if valid
        private static async Task<(bool IsValid, List<string> Errors, List<(double Due, double Paid)> Rows)> ValidateCsvAsync(Stream stream)
        {
            var errors = new List<string>();
            var rows = new List<(double Due, double Paid)>();

            using var reader = new StreamReader(stream);
            string? line;
            var lineNumber = 0;

            while ((line = await reader.ReadLineAsync()) != null)
            {
                lineNumber++;
                line = line.Trim();
                if (string.IsNullOrEmpty(line))
                {
                    // skip empty lines
                    continue;
                }

                var parts = line.Split(',');
                if (parts.Length != 2)
                {
                    errors.Add($"Line {lineNumber}: expected 2 comma-separated values but found {parts.Length}.");
                    continue;
                }

                var leftRaw = parts[0].Trim();
                var rightRaw = parts[1].Trim();

                if (!double.TryParse(leftRaw, NumberStyles.Float | NumberStyles.AllowLeadingWhite | NumberStyles.AllowTrailingWhite, CultureInfo.InvariantCulture, out var left))
                {
                    errors.Add($"Line {lineNumber}: left value '{leftRaw}' is not a valid number.");
                    continue;
                }

                if (!double.TryParse(rightRaw, NumberStyles.Float | NumberStyles.AllowLeadingWhite | NumberStyles.AllowTrailingWhite, CultureInfo.InvariantCulture, out var right))
                {
                    errors.Add($"Line {lineNumber}: right value '{rightRaw}' is not a valid number.");
                    continue;
                }

                if (left < 0 || right < 0)
                {
                    errors.Add($"Line {lineNumber}: negative numbers are not allowed (found {left}, {right}).");
                    continue;
                }

                if (!(left < right))
                {
                    errors.Add($"Line {lineNumber}: left value must be less than right value (found {left} >= {right}).");
                    continue;
                }

                rows.Add((left, right));
            }

            if (errors.Count > 0)
            {
                return (false, errors, rows);
            }

            if (rows.Count == 0)
            {
                errors.Add("File contains no valid data rows.");
                return (false, errors, rows);
            }

            return (true, errors, rows);
        }

        private string CalculateRowChange(List<Rule> rules, Setting? setting, (double Due, double Paid) row)
        {
            if (rules is null) throw new ArgumentNullException(nameof(rules));
            if (setting is null) throw new ArgumentNullException(nameof(setting));
            if (setting.Currency is null) throw new ArgumentException("Setting must include a Currency.", nameof(setting));
            if (setting.Currency.Denominations is null || setting.Currency.Denominations.Count == 0)
                throw new ArgumentException("Currency must contain at least one denomination.", nameof(setting));

            // Convert to integer cents to avoid floating-point rounding issues
            var dueCents = (int)Math.Round(row.Due * 100);
            var paidCents = (int)Math.Round(row.Paid * 100);
            var changeCents = paidCents - dueCents;

            var denominations = setting.Currency.Denominations
                .OrderByDescending(d => d.Value)
                .ToList();

            var matchingRule = CheckForMatchingRule(rules, dueCents, paidCents, changeCents);
            // if a matching 'mod' rule exists, produce a randomized correct breakdown
            if (matchingRule != null && matchingRule.RuleType == Enums.RuleType.Mod)
            {
                var results = CalculateChangeRandom(denominations, changeCents);
                string result = string.Join(", ", results);
                return result;
            }
            else
            {
                var results = CalculateChangeGreedy(denominations, changeCents);
                string result = string.Join(", ", results);
                return result;
            }
        }
        /// <summary>
        /// Calculate change breakdown using a greedy algorithm (largest denominations first).
        /// </summary>
        private List<string> CalculateChangeGreedy(List<Denomination> denominations, int changeCents)
        {
            var remaining = changeCents;
            var breakdown = new List<string>();
            foreach (var denom in denominations.OrderByDescending(d => d.Value))
            {
                if (denom.Value <= 0) continue;
                var count = remaining / denom.Value;
                if (count <= 0) continue;
                breakdown.Add(count + " " + denom.Name);
                remaining -= count * denom.Value;
            }
            return breakdown;
        }

        /// <summary>
        /// Produce a random but correct breakdown of change in cents using available denominations.
        /// </summary>
        private List<string> CalculateChangeRandom(List<Denomination> denominations, int changeCents)
        {
            if (changeCents <= 0) return new List<string>();

            // Order descending so we try larger denominations first when choosing random counts
            var ordered = denominations.OrderByDescending(d => d.Value).ToList();
            if (ordered.Count == 0) return new List<string>();

            var smallest = ordered.Last();
            if (smallest.Value <= 0)
            {
                // invalid denomination data, fall back to greedy
                return CalculateChangeGreedy(denominations, changeCents);
            }

            var rng = Random.Shared;
            var results = new List<string>();

            foreach (var denom in ordered)
            {
                if (denom.Value > changeCents)
                    continue;

                // If it's the smallest denomination,
                // force it to take the remaining amount
                if (denom == smallest)
                {
                    var count = changeCents / denom.Value;
                    if (count > 0)
                        results.Add(count + " " + denom.Name);
                    break;
                }

                var max = changeCents / denom.Value;
                var countRandom = rng.Next(0, max + 1);

                if (countRandom > 0)
                {
                    results.Add(countRandom + " " + denom.Name);
                    changeCents -= countRandom * denom.Value;
                }
            }

            return results;
        }


        private Rule? CheckForMatchingRule(List<Rule> rules, int dueCents, int paidCents, int changeCents)
        {
            //check for rules that match, first match wins
            //currently supporting only random via the mod
            //could extend logic here to account for other rule types
            foreach (var rule in rules)
            {
                if (rule.RuleTarget == Enums.RuleTarget.Change)
                {
                    if (rule.RuleType == Enums.RuleType.Mod)
                    {
                        if (rule.ModValue > 0 && changeCents % rule.ModValue == 0)
                        {
                            return rule;
                        }
                    }
                }
                else if (rule.RuleTarget == Enums.RuleTarget.AmountPaid)
                {
                    if (rule.RuleType == Enums.RuleType.Mod)
                    {
                        if (rule.ModValue > 0 && paidCents % rule.ModValue == 0)
                        {
                            return rule;
                        }
                    }
                }
                else if (rule.RuleTarget == Enums.RuleTarget.Price)
                {
                    if (rule.RuleType == Enums.RuleType.Mod)
                    {
                        if (rule.ModValue > 0 && dueCents % rule.ModValue == 0)
                        {
                            return rule;
                        }
                    }
                }
            }
            return null;
        }

        /// <summary>
        /// Result returned from a single row change calculation.
        /// </summary>
        private sealed record ChangeCalculationResult(double Due, double Paid, List<(int Value, string Name, int Count)> Breakdown, int ChangeInCents);
    }
}
