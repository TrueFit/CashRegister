namespace CashRegister.Server
{
    public class Change
    {
        public required string Denomination { get; set; }
        public int Count { get; set; }
    }
}
