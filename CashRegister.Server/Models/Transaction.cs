namespace CashRegister.Server.Models
{
    public class Transaction
    {
        public decimal Due { get; set; }
        public decimal Paid { get; set; }
        public required string Currency { get; set; }
    }
}
