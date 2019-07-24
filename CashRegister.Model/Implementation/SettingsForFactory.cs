using CashRegister.Model.Interfaces;

namespace CashRegister.Model.Implementation
{
    public class SettingsForFactory : ISettings
    {
        public int DivisorForRandomChange { get; set; }

        public double AmountOwed { get; set; }

        public double AmountPaid { get; set; }
    }
}
