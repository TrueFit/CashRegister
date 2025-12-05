using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CashRegister.Server.Models
{
    public class Change
    {
        public required string Denomination { get; set; }
        public int Count { get; set; }
    }
}
