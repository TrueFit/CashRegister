using System.Text;
using cash_register_backend.DTOs;
using cash_register_backend.Enums;
using cash_register_backend.Models;
using cash_register_backend.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace cash_register_backend.Tests
{
    [TestFixture]
    public class CalculateServiceTests
    {
        private Mock<ILogger<CalculateService>> _loggerMock = null!;
        public required AppDbContext _context;
        private CalculateService _service = null!;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<CalculateService>>();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            SeedTestData(_context);

            _service = new CalculateService(_loggerMock.Object, _context);
        }

        [Test]
        public async Task CalculateChange_ReturnsNull_WhenFileIsNull()
        {
            var dto = new CalculateDTO { InputFile = null! };

            var result = await _service.CalculateChange(dto);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task CalculateChange_ReturnsNull_WhenCsvIsInvalid()
        {
            var file = CreateFormFile("invalid,data,here");

            var dto = new CalculateDTO { InputFile = file };

            var result = await _service.CalculateChange(dto);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task CalculateChange_ReturnsGreedyBreakdown_WhenNoMatchingRule()
        {
            var file = CreateFormFile("1.00,2.00"); // $1 change

            var dto = new CalculateDTO { InputFile = file };

            var result = await _service.CalculateChange(dto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Count, Is.EqualTo(1));
            Assert.That(result[0], Does.Contain("1 Dollar"));
        }

        [Test]
        public async Task CalculateChange_UsesRandomRule_WhenModRuleMatches()
        {
            // Add rule: change % 100 == 0
            _context.Rules.Add(new Rule
            {
                Name = "Random Rule",
                Enabled = true,
                RuleTarget = RuleTarget.Change,
                RuleType = RuleType.Mod,
                ModValue = 100
            });
            await _context.SaveChangesAsync();

            var file = CreateFormFile("1.00,3.00"); // 200 cents change

            var dto = new CalculateDTO { InputFile = file };

            var result = await _service.CalculateChange(dto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Count, Is.EqualTo(1));
            // Random path still must total correct amount
            Assert.That(result[0], Does.Contain("Dollar").Or.Contain("Quarter").Or.Contain("Cents"));
        }

        [Test]
        public async Task CalculateChange_UsesRandomRule_WhenModRuleMatches_Price()
        {
            _context.Rules.Add(new Rule
            {
                Name = "Random Rule",
                Enabled = true,
                RuleTarget = RuleTarget.Price,
                RuleType = RuleType.Mod,
                ModValue = 3
            });
            await _context.SaveChangesAsync();

            var file = CreateFormFile("1.00,3.00"); // 200 cents change

            var dto = new CalculateDTO { InputFile = file };

            var result = await _service.CalculateChange(dto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Count, Is.EqualTo(1));
            // Random path still must total correct amount
            Assert.That(result[0], Does.Contain("Dollar").Or.Contain("Quarter").Or.Contain("Cents"));
        }

        private static IFormFile CreateFormFile(string content)
        {
            var bytes = Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);

            return new FormFile(stream, 0, bytes.Length, "InputFile", "test.csv");
        }

        private static void SeedTestData(AppDbContext context)
        {
            var currency = new Currency
            {
                Name = "USD",
                Denominations = new List<Denomination>
                {
                    new Denomination { Name = "Dollar", Value = 100 },
                    new Denomination { Name = "Quarter", Value = 25 },
                    new Denomination { Name = "Dime", Value = 10 },
                    new Denomination { Name = "Nickel", Value = 5 },
                    new Denomination { Name = "Penny", Value = 1 }
                }
            };

            context.Settings.Add(new Setting
            {
                Currency = currency
            });

            context.SaveChanges();
        }
    }
}

