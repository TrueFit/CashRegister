namespace CashRegister.Core.Denominations
{
    /// <summary>
    /// Represents a dollar denomination
    /// </summary>
    public class Dollar : Denomination
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public Dollar() : base("dollar", 1.00) { }
    }
}
