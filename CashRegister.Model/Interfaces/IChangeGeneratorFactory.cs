namespace CashRegister.Model.Interfaces
{
    public interface IChangeGeneratorFactory
    {
        IChangeGenerator Create(ISettings settings);
    }
}
