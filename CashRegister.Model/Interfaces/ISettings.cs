namespace CashRegister.Model.Interfaces
{
    public interface ISettings
    {
        int DivisorForRandomChange { get; set; }
        double AmountOwed { get; set; }
        double AmountPaid { get; set; }
    }
}
