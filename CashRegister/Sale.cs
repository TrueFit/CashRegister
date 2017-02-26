
namespace CashRegister
{
    public class Sale : ITransaction
    {

        public int AmountPaid { get; set; }
        public int Cost { get; set; }

        public int PerformTransaction()
        {
            return AmountPaid - Cost;
        }
    }
}
