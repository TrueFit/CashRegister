using cash_register_backend.Enums;

namespace cash_register_backend.Models
{
    public class Rule
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public bool Enabled { get; set; }
        public RuleTarget RuleTarget { get; set; }
        public RuleType RuleType { get; set; }
        public int ModValue { get; set; } = 1;
    }
}
