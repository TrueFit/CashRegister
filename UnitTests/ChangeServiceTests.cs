using Microsoft.VisualStudio.TestTools.UnitTesting;
using Interfaces;
using Services;
using DomainModels;

namespace UnitTests
{
    [TestClass]
    public class ChangeServiceTests
    {
        IChangeService Service;

        [TestInitialize]
        public void Setup()
        {
            Service = new ChangeService(",", "USD", 3);
        }

        [TestMethod]
        public void GetCurrency_should_return_UsDollar()
        {
            var result = Service.GetCurrency("USD");
            Assert.IsTrue(result is USDollar);
        }

    }
}
