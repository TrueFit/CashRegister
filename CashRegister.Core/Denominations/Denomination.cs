using CashRegister.Interfaces.Denominations;

namespace CashRegister.Core.Denominations
{
    /// <summary>
    /// Represents a generic monetary denomination with a corresponding name and value
    /// </summary>
    public class Denomination : IDenomination
    {
        private double val;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="n">Denomination name</param>
        /// <param name="v">Denomination value</param>
        public Denomination(string n, double v)
        {
            Name = n;
            val = v;
        }

        /// <summary>
        /// Name Property
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// Value Property
        /// </summary>
        public double Value
        {
            get
            {
                return val;
            }
        }

        /// <summary>
        /// Determines the number of this monetary denomination that is needed to make change for the given amount
        /// </summary>
        /// <param name="inValue">The value to make change for</param>
        /// <returns>A truncated integer representing the amount of this denomination needed</returns>
        public int MakeChange(double inValue)
        {
            // Subtract a small factor to prevent division results ending in .99999
            // which would then be truncated to an incorrect value
            double reduced = val - 0.0000000001;
            return (int) System.Math.Truncate(inValue / reduced);
        }

        /// <summary>
        /// Calculates the remainder owed, minus the calculated change for this denomination
        /// </summary>
        /// <param name="inValue">Current value owed</param>
        /// <param name="count">Count of this denomination needed</param>
        /// <returns>Remainder of amount owed</returns>
        public double GetRemainder(double inValue, int count)
        {
            return inValue - (val * (double)count);
        }
    }
}
