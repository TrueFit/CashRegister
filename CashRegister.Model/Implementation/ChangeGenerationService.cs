using CashRegister.Model.Interfaces;

namespace CashRegister.Model.Implementation
{
    public class ChangeGenerationService : IChangeGenerationService
    {
        private readonly IChangeGeneratorFactory _factory;

        public ChangeGenerationService(IChangeGeneratorFactory factory)
        {
            _factory = factory;
        }

        public string GenerateChange(ISettings settings)
        {
            IChangeGenerator generator = _factory.Create(settings);

            return generator.Generate(settings.AmountOwed, settings.AmountPaid);
        }
    }
}
