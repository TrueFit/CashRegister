namespace cash_register_backend.Models
{
    public class Currency
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<Denomination> Denominations { get; set; } = new List<Denomination>();
    }
}
