
namespace CashRegister
{
    public class CashRegister
    {
        public ITransaction Action { get; set; }

        public int DoTheThing()
        {
            return Action.PerformTransaction();
        }
    }
}
