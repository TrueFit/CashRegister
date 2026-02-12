using cash_register_backend.Models;

namespace cash_register_backend.DTOs
{
    public class SettingDTO
    {
        public int Id { get; set; }
        public required Currency Currency { get; set; }
    }
}
