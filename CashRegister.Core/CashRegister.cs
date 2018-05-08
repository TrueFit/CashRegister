using System;

namespace CashRegister.Core
{
    /// <summary>
    /// Class containing the logic to either a random amount or 
    /// the least amount of each denomination of physical change.
    /// </summary>
    public class CashRegister : ICashRegister
    {
        private static readonly Random Random = new Random();

        /// <summary>
        /// Calculates either a random amount or the least amount of each denomination of physical change.
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public string ProcessChange(string input)
        {
            (decimal price, decimal paid) = ParseDecimals(input);

            // if the price is divisable by 3, provide random change output.
            var isOutputRandom = price * 100 % 3 == 0;

            var totalChange = paid - price;
            
            return isOutputRandom
                ? CalculateRandomChange(totalChange)
                : CalculateLowestAmountOfChange(totalChange);
        }

        /// <summary>
        /// Uses integer math to provide the least physical amount of change to the customer.
        /// </summary>
        /// <param name="totalChange">The total amount of change owed to the customer.</param>
        /// <returns>A string containing the lowest amount of physical change possible given the amount owed/paid.</returns>
        private string CalculateLowestAmountOfChange(decimal totalChange)
        {
            // convert to use integer math below.
            var changeInt = (int)Math.Round(totalChange * 100);
            var result = new ChangeResult();
            
            result.Hundreds += changeInt / 10000;
            changeInt %= 10000;

            result.Fifties += changeInt / 5000;
            changeInt %= 5000;

            result.Twenties += changeInt / 2000;
            changeInt %= 2000;

            result.Tens += changeInt / 1000;
            changeInt %= 1000;

            result.Fives += changeInt / 500;
            changeInt %= 500;

            result.Dollars += changeInt / 100;
            changeInt %= 100;

            result.Quarters += changeInt / 25;
            changeInt %= 25;

            result.Dimes += changeInt / 10;
            changeInt %= 10;

            result.Nickles += changeInt / 5;
            changeInt %= 5;

            result.Pennies += changeInt;

            return result.ToString();
        }

        /// <summary>
        /// Generates a random amount of each physical denomination to add up to the amount of change owed.
        /// </summary>
        /// <param name="totalChange">The total amount of change owed to the customer.</param>
        /// <returns>A string containing a random amount of physical change possible given the amount owed/paid.</returns>
        private string CalculateRandomChange(decimal totalChange)
        {
            var denominations = new[] { 100.00m, 50.00m, 20.00m, 10.00m, 5.00m, 1.00m, 0.25m, 0.10m, 0.05m, 0.01m };
            var changeResult = new ChangeResult();

            foreach (var denomination in denominations)
            {
                if (denomination > totalChange) continue;
                // if we're at the last interation, set pennies equal to the remainder
                if (denomination == 0.01m)
                {
                    changeResult.AddDenomination(denomination, (int)(totalChange * 100));
                    break;
                }
                // we can use this denomination, so lets find a random value we can use
                var randomAmount = Random.Next(0, (int) (totalChange / denomination));
                totalChange -= denomination * randomAmount;
                changeResult.AddDenomination(denomination, randomAmount);
            }

            return changeResult.ToString();
        }

        /// <summary>
        /// Consumes a string, performs validation, and returns price/paid decimals.
        /// </summary>
        /// <param name="input">Input should be in the format "price,paid". E.g. "1.97,2.00"</param>
        /// <returns>Two parsed decimals 'Price' and 'Paid'.</returns>
        private (decimal, decimal) ParseDecimals(string input)
        {
            var split = input.Split(',');

            if (split.Length == 2 && decimal.TryParse(split[0], out var price) && decimal.TryParse(split[1], out var paid))
            {
                if (price <= paid) return (price, paid);

                throw new ArgumentException($"Amount owed ({price}) is more than the amount paid ({paid}).");
            }

            throw new ArgumentException($"Input string not in correct format: ({input}). " +
                                        "Should be in the format \"price,paid\". E.g. \"1.97,2.00\"", nameof(input));
        }
    }
}
