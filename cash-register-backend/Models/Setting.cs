using cash_register_backend.Enums;

namespace cash_register_backend.Models
{
    //If in the future we want users to have the ability to have different settings it makes sense to make this a table for now
    public class Setting
    {
        public int Id { get; set; }
        public required Currency Currency { get; set; }
    }
}
