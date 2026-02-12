namespace cash_register_backend.DTOs
{
    public class DenominationDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int Value { get; set; } = 1;
    }
}
