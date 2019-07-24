using CashRegister.Model.Implementation;
using CashRegister.Model.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CashRegister.UnitTests.Model
{
    [TestClass]
    public class ChangeGeneratorServiceUnitTests
    {
        [TestMethod]
        public void Should_Return_Correct_Output()
        {
            // Setup
            const double OWED = 1.0;
            const double PAID = 2.0;
            const string EXPECTED_CHANGE = "1 dollar";

            var settingsMock = new Mock<ISettings>();
            settingsMock.SetupAllProperties();

            settingsMock.Object.AmountOwed = OWED;
            settingsMock.Object.AmountPaid = PAID;

            var generatorMock = new Mock<IChangeGenerator>();
            generatorMock.Setup(g => g.Generate(OWED, PAID))
                         .Returns(EXPECTED_CHANGE);

            var factoryMock = new Mock<IChangeGeneratorFactory>();
            factoryMock.Setup(f => f.Create(settingsMock.Object))
                       .Returns(() => generatorMock.Object);
            
            var service = new ChangeGenerationService(factoryMock.Object);

            // Execute
            string actual = service.GenerateChange(settingsMock.Object);

            // Check
            Assert.AreEqual(EXPECTED_CHANGE, actual);
        }
    }
}
