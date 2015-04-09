namespace Dollar.Web.Common
{
    public interface ICalculator
    {
        string Calculate(decimal amountOwed, decimal amountPaid);
    }
}
