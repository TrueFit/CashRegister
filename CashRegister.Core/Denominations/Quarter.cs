namespace CashRegister.Core.Denominations
{
    /// <summary>
    /// Represents a quarter denomination
    /// </summary>
    public class Quarter : Denomination
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public Quarter() : base("quarter", 0.25) { }
    }
}
