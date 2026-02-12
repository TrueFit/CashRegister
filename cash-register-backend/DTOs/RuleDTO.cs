using cash_register_backend.Enums;

namespace cash_register_backend.DTOs
{
    public class RuleDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public bool Enabled { get; set; }
        public required string RuleTarget { get; set; }
        public required string RuleType { get; set; }
        public int ModValue { get; set; }
    }
}
