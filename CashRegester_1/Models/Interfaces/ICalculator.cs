namespace Models.Interfaces
{
    public interface ICalculator
    {
        public string Calculate(decimal owed, decimal paid, int? randomDivisor);
    }
}
