using CashRegister.Model.Implementation;
using CashRegister.Model.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CashRegister.UnitTests.Model
{
    [TestClass]
    public class ChangeGeneratorFactoryUnitTests
    {
        [TestMethod]
        public void Should_Return_RandomChangeGenerator()
        {
            // Setup
            const double OWED = 3.36;
            const double PAID = 4.15;

            var settingsMock = new Mock<ISettings>();

            settingsMock.SetupAllProperties();
            settingsMock.Object.AmountOwed = OWED;
            settingsMock.Object.AmountPaid = PAID;
            settingsMock.Object.DivisorForRandomChange = 3;

            var factory = new ChangeGeneratorFactory();

            // Execute
            IChangeGenerator generator = factory.Create(settingsMock.Object);

            // Check
            Assert.IsInstanceOfType(generator, typeof(RandomChangeGenerator));
        }

        [TestMethod]
        public void Should_Return_LeastAmountOfChangeGenerator()
        {
            // Setup
            const double OWED = 5.0;
            const double PAID = 4.15;

            var settingsMock = new Mock<ISettings>();

            settingsMock.SetupAllProperties();
            settingsMock.Object.AmountOwed = OWED;
            settingsMock.Object.AmountPaid = PAID;
            settingsMock.Object.DivisorForRandomChange = 3;

            var factory = new ChangeGeneratorFactory();

            // Execute
            IChangeGenerator generator = factory.Create(settingsMock.Object);

            // Check
            Assert.IsInstanceOfType(generator, typeof(LeastAmountOfChangeGenerator));
        }
    }
}
