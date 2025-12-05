using System.ComponentModel.DataAnnotations;

namespace CashRegister.Server.Models
{
    public class Currency
    {
        [Key]
        public required string CurrencyCode { get; set; }
        public required string Name { get; set; }
        public List<Denomination>? Denominations { get; set; }
    }
}
