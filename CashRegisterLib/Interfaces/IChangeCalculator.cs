namespace CashRegisterLib
{
    public interface IChangeCalculator
    {
        ChangeCounter GetChangeOutput(decimal changeDue);
    }
}
