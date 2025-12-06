using Microsoft.EntityFrameworkCore;

namespace CashRegister.Server.Models
{
    [PrimaryKey("CurrencyCode","Name")]
    public class Denomination
    {
        public required string CurrencyCode { get; set; }
        public required string Name { get; set; }
        public required string Plural { get; set; }
        public decimal Value { get; set; }
    }
}
