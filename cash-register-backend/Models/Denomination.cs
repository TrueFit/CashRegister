namespace cash_register_backend.Models
{
    public class Denomination
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int Value { get; set; } = 1;
    }
}
