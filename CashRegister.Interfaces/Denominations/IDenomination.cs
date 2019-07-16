namespace CashRegister.Interfaces.Denominations
{
    /// <summary>
    /// Denomination Interface
    /// </summary>
    public interface IDenomination
    {
        string Name { get; }
        double Value { get; }

        int MakeChange(double inValue);
        double GetRemainder(double inValue, int count);
    }
}
