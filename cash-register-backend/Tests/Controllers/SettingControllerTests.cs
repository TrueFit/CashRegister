using cash_register_backend.Controllers;
using cash_register_backend.DTOs;
using cash_register_backend.Models;
using cash_register_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace cash_register_backend.Tests.Controllers
{
    [TestFixture]
    public class SettingsControllerTests
    {
        private Mock<ISettingsService> _serviceMock = null!;
        private Mock<ILogger<SettingsController>> _loggerMock = null!;
        private SettingsController _controller = null!;

        [SetUp]
        public void Setup()
        {
            _serviceMock = new Mock<ISettingsService>();
            _loggerMock = new Mock<ILogger<SettingsController>>();

            _controller = new SettingsController(
                _loggerMock.Object,
                _serviceMock.Object);
        }

        #region GetSetting

        [Test]
        public async Task GetSetting_ReturnsOk_WhenSettingExists()
        {
            var setting = new SettingDTO
            {
                Id = 1,
                Currency = new Currency() { Id = 1, Name = "USD" }
            };

            _serviceMock
                .Setup(s => s.GetSetting(1))
                .ReturnsAsync(setting);

            var result = await _controller.GetSetting(1);

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());

            var ok = result.Result as OkObjectResult;
            Assert.That(ok!.Value, Is.EqualTo(setting));
        }

        [Test]
        public async Task GetSetting_ReturnsNotFound_WhenSettingDoesNotExist()
        {
            _serviceMock
                .Setup(s => s.GetSetting(1))
                .ReturnsAsync((SettingDTO?)null);

            var result = await _controller.GetSetting(1);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());

            var notFound = result.Result as NotFoundObjectResult;
            Assert.That(notFound!.Value, Is.EqualTo("Setting with ID 1 not found."));
        }

        #endregion

        #region GetCurrencies

        [Test]
        public async Task GetCurrencies_ReturnsOk_WhenCurrenciesExist()
        {
            var currencies = new List<CurrencyDTO>
            {
                new CurrencyDTO { Id = 1, Name = "USD" },
                new CurrencyDTO { Id = 2, Name = "EUR" }
            };

            _serviceMock
                .Setup(s => s.GetAllCurrencies())
                .ReturnsAsync(currencies);

            var result = await _controller.GetCurrencies(1);

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());

            var ok = result.Result as OkObjectResult;
            Assert.That(ok!.Value, Is.EqualTo(currencies));
        }

        [Test]
        public async Task GetCurrencies_ReturnsNotFound_WhenCurrenciesAreNull()
        {
            _serviceMock
                .Setup(s => s.GetAllCurrencies())
                .ReturnsAsync((List<CurrencyDTO>?)null);

            var result = await _controller.GetCurrencies(1);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());

            var notFound = result.Result as NotFoundObjectResult;
            Assert.That(notFound!.Value, Is.EqualTo("Currencies not found."));
        }

        [Test]
        public async Task GetCurrencies_ReturnsNotFound_WhenCurrenciesAreEmpty()
        {
            _serviceMock
                .Setup(s => s.GetAllCurrencies())
                .ReturnsAsync(new List<CurrencyDTO>());

            var result = await _controller.GetCurrencies(1);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());
        }

        #endregion

        #region UpdateSetting

        [Test]
        public async Task UpdateSetting_ReturnsBadRequest_WhenBodyIsNull()
        {
            var result = await _controller.UpdateSetting(1, null!);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result.Result as BadRequestObjectResult;
            Assert.That(badRequest!.Value, Is.EqualTo("Request body is required."));
        }

        [Test]
        public async Task UpdateSetting_ReturnsBadRequest_WhenModelStateInvalid()
        {
            _controller.ModelState.AddModelError("Currency", "Required");

            var dto = new SettingDTO
            {
                Id = 1,
                Currency = new Currency() { Id = 1, Name = "USD" }
            }; ;

            var result = await _controller.UpdateSetting(1, dto);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateSetting_ReturnsBadRequest_WhenRouteIdMismatch()
        {
            var dto = new SettingDTO
            {
                Id = 2,
                Currency = new Currency() { Id = 1, Name = "USD" }
            }; ;

            var result = await _controller.UpdateSetting(1, dto);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result.Result as BadRequestObjectResult;
            Assert.That(badRequest!.Value,
                Is.EqualTo("Route id does not match setting id in body."));
        }

        [Test]
        public async Task UpdateSetting_ReturnsBadRequest_WhenServiceReturnsNull()
        {
            var dto = new SettingDTO
            {
                Id = 1,
                Currency = new Currency() { Id = 1, Name = "USD" }
            };

            _serviceMock
                .Setup(s => s.UpdateSetting(dto))
                .ReturnsAsync((SettingDTO?)null);

            var result = await _controller.UpdateSetting(1, dto);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result.Result as BadRequestObjectResult;
            Assert.That(badRequest!.Value,
                Is.EqualTo("Unable to update setting with ID 1."));
        }

        [Test]
        public async Task UpdateSetting_ReturnsOk_WhenUpdateSucceeds()
        {
            var dto = new SettingDTO
            {
                Id = 1,
                Currency = new Currency() { Id = 1, Name = "USD" }
            };

            _serviceMock
                .Setup(s => s.UpdateSetting(dto))
                .ReturnsAsync(dto);

            var result = await _controller.UpdateSetting(1, dto);

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());

            var ok = result.Result as OkObjectResult;
            Assert.That(ok!.Value, Is.EqualTo(dto));
        }

        #endregion
    }
}
