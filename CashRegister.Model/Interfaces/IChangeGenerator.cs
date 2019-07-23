namespace CashRegister.Model.Interfaces
{
    public interface IChangeGenerator
    {
        string Generate(double amountOwed, double amountPaid);
    }
}
