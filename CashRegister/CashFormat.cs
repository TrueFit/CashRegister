
namespace CashRegister
{
    public class CashFormat
    {
        public int DollarAmount { get; set; }
        public int QuaterAmount { get; set; }
        public int DimeAmount { get; set; }
        public int NickelAmount { get; set; }
        public int PennyAmount { get; set; }
    }

    public class CashFileStructure
    {
        public int IntegerPart { get; set; }
        public int DecimalPart { get; set; }
        public bool OwedAmountDivisibleByThree { get; set; }
    }
}
