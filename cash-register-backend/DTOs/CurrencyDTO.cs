using cash_register_backend.Models;

namespace cash_register_backend.DTOs
{
    public class CurrencyDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<DenominationDTO> Denominations { get; set; } = new List<DenominationDTO>();
    }
}
