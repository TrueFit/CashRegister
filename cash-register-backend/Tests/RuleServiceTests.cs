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
    public class RuleServiceTests
    {
        private AppDbContext _context = null!;
        private RuleService _service = null!;
        private Mock<ILogger<RuleService>> _loggerMock = null!;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<RuleService>>();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);

            _service = new RuleService(_loggerMock.Object, _context);
        }

        [Test]
        public async Task GetRule_ReturnsNull_WhenRuleDoesNotExist()
        {
            var result = await _service.GetRule(999);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetRule_ReturnsMappedDto_WhenRuleExists()
        {
            var rule = new Rule
            {
                Id = 1,
                Name = "Test Rule",
                Enabled = true,
                RuleTarget = RuleTarget.Change,
                RuleType = RuleType.Mod,
                ModValue = 5
            };

            _context.Rules.Add(rule);
            await _context.SaveChangesAsync();

            var result = await _service.GetRule(1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Id, Is.EqualTo(1));
            Assert.That(result.Name, Is.EqualTo("Test Rule"));
            Assert.That(result.Enabled, Is.True);
            Assert.That(result.RuleTarget, Is.EqualTo("Change"));
            Assert.That(result.RuleType, Is.EqualTo("Mod"));
            Assert.That(result.ModValue, Is.EqualTo(5));
        }

        [Test]
        public async Task GetAllRules_ReturnsEmptyList_WhenNoRulesExist()
        {
            var result = await _service.GetAllRules();

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Count, Is.EqualTo(0));
        }

        [Test]
        public async Task GetAllRules_ReturnsMappedRules_WhenRulesExist()
        {
            _context.Rules.Add(new Rule
            {
                Id = 1,
                Name = "Rule 1",
                Enabled = true,
                RuleTarget = RuleTarget.Change,
                RuleType = RuleType.Mod,
                ModValue = 10
            });

            _context.Rules.Add(new Rule
            {
                Id = 2,
                Name = "Rule 2",
                Enabled = false,
                RuleTarget = RuleTarget.Price,
                RuleType = RuleType.Mod,
                ModValue = 3
            });

            await _context.SaveChangesAsync();

            var result = await _service.GetAllRules();

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Count, Is.EqualTo(2));
            Assert.That(result.Any(r => r.Name == "Rule 1"), Is.True);
            Assert.That(result.Any(r => r.Name == "Rule 2"), Is.True);
        }

        [Test]
        public async Task UpdateRule_ReturnsNull_WhenRuleDoesNotExist()
        {
            var dto = new RuleDTO
            {
                Id = 999,
                Name = "Updated",
                Enabled = true,
                RuleTarget = "Change",
                RuleType = "Mod",
                ModValue = 7
            };

            var result = await _service.UpdateRule(dto);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task UpdateRule_UpdatesRuleCorrectly_WhenRuleExists()
        {
            var rule = new Rule
            {
                Id = 1,
                Name = "Original",
                Enabled = false,
                RuleTarget = RuleTarget.Price,
                RuleType = RuleType.Mod,
                ModValue = 2
            };

            _context.Rules.Add(rule);
            await _context.SaveChangesAsync();

            var updateDto = new RuleDTO
            {
                Id = 1,
                Name = "Updated",
                Enabled = true,
                RuleTarget = "Change",
                RuleType = "Mod",
                ModValue = 10
            };

            var result = await _service.UpdateRule(updateDto);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.Name, Is.EqualTo("Updated"));
            Assert.That(result.Enabled, Is.True);
            Assert.That(result.RuleTarget, Is.EqualTo("Change"));
            Assert.That(result.ModValue, Is.EqualTo(10));

            var updatedEntity = await _context.Rules.FirstAsync(r => r.Id == 1);
            Assert.That(updatedEntity.Name, Is.EqualTo("Updated"));
            Assert.That(updatedEntity.Enabled, Is.True);
            Assert.That(updatedEntity.RuleTarget, Is.EqualTo(RuleTarget.Change));
            Assert.That(updatedEntity.ModValue, Is.EqualTo(10));
        }
    }

}
