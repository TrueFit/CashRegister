using cash_register_backend.DTOs;
using cash_register_backend.Models;
using cash_register_backend.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace cash_register_backend.Tests
{
    [TestFixture]
    public class SettingsServiceTests
    {
        private AppDbContext _context = null!;
        private SettingsService _service = null!;
        private Mock<ILogger<SettingsService>> _loggerMock = null!;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _loggerMock = new Mock<ILogger<SettingsService>>();

            _service = new SettingsService(_loggerMock.Object, _context);
        }

        [Test]
        public async Task UpdateSetting_ReturnsNull_WhenSettingDoesNotExist()
        {
            var dto = new SettingDTO
            {
                Id = 999,
                Currency = new Currency { Id = 1, Name = "USD" }
            };

            var result = await _service.UpdateSetting(dto);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task UpdateSetting_UpdatesCurrency_WhenSettingExists()
        {
            var currency1 = new Currency { Id = 1, Name = "USD" };
            var currency2 = new Currency { Id = 2, Name = "EUR" };

            _context.Currencies.AddRange(currency1, currency2);

            var setting = new Setting
            {
                Id = 1,
                Currency = currency1
            };

            _context.Settings.Add(setting);
            await _context.SaveChangesAsync();

            var updateDto = new SettingDTO
            {
                Id = 1,
                Currency = currency2
            };

            var result = await _service.UpdateSetting(updateDto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Currency.Id, Is.EqualTo(2));

            var updatedEntity = await _context.Settings.Include(s => s.Currency).FirstAsync();
            Assert.That(updatedEntity.Currency.Id, Is.EqualTo(2));
        }

        [Test]
        public async Task GetSetting_ReturnsNull_WhenNotFound()
        {
            var result = await _service.GetSetting(123);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetSetting_ReturnsMappedSetting_WhenFound()
        {
            var currency = new Currency { Id = 1, Name = "USD" };

            var setting = new Setting
            {
                Id = 1,
                Currency = currency
            };

            _context.Currencies.Add(currency);
            _context.Settings.Add(setting);
            await _context.SaveChangesAsync();

            var result = await _service.GetSetting(1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Id, Is.EqualTo(1));
            Assert.That(result.Currency.Name, Is.EqualTo("USD"));
        }

        [Test]
        public async Task GetAllCurrencies_ReturnsEmptyList_WhenNoneExist()
        {
            var result = await _service.GetAllCurrencies();

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(0));
        }

        [Test]
        public async Task GetAllCurrencies_ReturnsMappedAndOrderedCurrencies()
        {
            var currency = new Currency
            {
                Id = 1,
                Name = "USD",
                Denominations = new List<Denomination>
                {
                    new Denomination { Id = 1, Name = "Penny", Value = 1 },
                    new Denomination { Id = 2, Name = "Dollar", Value = 100 },
                    new Denomination { Id = 3, Name = "Quarter", Value = 25 }
                }
            };

            _context.Currencies.Add(currency);
            await _context.SaveChangesAsync();

            var result = await _service.GetAllCurrencies();

            Assert.That(result.Count, Is.EqualTo(1));

            var dto = result.First();
            Assert.That(dto.Name, Is.EqualTo("USD"));
            Assert.That(dto.Denominations.Count, Is.EqualTo(3));

            // Ensure ordering descending by Value
            Assert.That(dto.Denominations[0].Value, Is.EqualTo(100));
            Assert.That(dto.Denominations[1].Value, Is.EqualTo(25));
            Assert.That(dto.Denominations[2].Value, Is.EqualTo(1));
        }
    }
}
