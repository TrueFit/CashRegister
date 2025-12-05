namespace CashRegister.Server
{
    public class Transaction
    {
        public decimal Due { get; set; }
        public decimal Paid { get; set; }
        public required string Currency { get; set; }
    }
}
