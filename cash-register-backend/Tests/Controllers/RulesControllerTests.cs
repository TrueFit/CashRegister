using cash_register_backend.Controllers;
using cash_register_backend.DTOs;
using cash_register_backend.Enums;
using cash_register_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace cash_register_backend.Tests.Controllers
{
    [TestFixture]
    public class RulesControllerTests
    {
        private Mock<IRuleSerivce> _serviceMock = null!;
        private Mock<ILogger<RulesController>> _loggerMock = null!;
        private RulesController _controller = null!;

        [SetUp]
        public void Setup()
        {
            _serviceMock = new Mock<IRuleSerivce>();
            _loggerMock = new Mock<ILogger<RulesController>>();

            _controller = new RulesController(
                _loggerMock.Object,
                _serviceMock.Object);
        }

        #region GetRule

        [Test]
        public async Task GetRule_ReturnsOk_WhenRuleExists()
        {
            var rule = new RuleDTO
            {
                Id = 1,
                Name = "Test Rule",
                RuleTarget = RuleTarget.Price.ToString(),
                RuleType = RuleType.Mod.ToString(),
            };

            _serviceMock
                .Setup(s => s.GetRule(1))
                .ReturnsAsync(rule);

            var result = await _controller.GetRule(1);

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());

            var ok = result.Result as OkObjectResult;
            Assert.That(ok!.Value, Is.EqualTo(rule));
        }

        [Test]
        public async Task GetRule_ReturnsNotFound_WhenRuleDoesNotExist()
        {
            _serviceMock
                .Setup(s => s.GetRule(1))
                .ReturnsAsync((RuleDTO?)null);

            var result = await _controller.GetRule(1);

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());

            var notFound = result.Result as NotFoundObjectResult;
            Assert.That(notFound!.Value, Is.EqualTo("Rule with ID 1 not found."));
        }

        #endregion

        #region GetAllRules

        [Test]
        public async Task GetAllRules_ReturnsOk_WhenRulesExist()
        {
            var rules = new List<RuleDTO>
            {
                new RuleDTO { Id = 1,
                    Name = "Rule 1",
                    RuleTarget = RuleTarget.Price.ToString(),
                    RuleType = RuleType.Mod.ToString()},
                new RuleDTO { Id = 2, 
                    Name = "Rule 2",
                    RuleTarget = RuleTarget.Price.ToString(),
                    RuleType = RuleType.Mod.ToString() }
            };

            _serviceMock
                .Setup(s => s.GetAllRules())
                .ReturnsAsync(rules);

            var result = await _controller.GetAllRules();

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());

            var ok = result.Result as OkObjectResult;
            Assert.That(ok!.Value, Is.EqualTo(rules));
        }

        [Test]
        public async Task GetAllRules_ReturnsNotFound_WhenServiceReturnsNull()
        {
            _serviceMock
                .Setup(s => s.GetAllRules())
                .ReturnsAsync((List<RuleDTO>?)null);

            var result = await _controller.GetAllRules();

            Assert.That(result.Result, Is.TypeOf<NotFoundObjectResult>());

            var notFound = result.Result as NotFoundObjectResult;
            Assert.That(notFound!.Value, Is.EqualTo("No rules were found."));
        }

        #endregion

        #region UpdateRule

        [Test]
        public async Task UpdateRule_ReturnsBadRequest_WhenBodyIsNull()
        {
            var result = await _controller.UpdateRule(1, null!);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result.Result as BadRequestObjectResult;
            Assert.That(badRequest!.Value, Is.EqualTo("Request body is required."));
        }

        [Test]
        public async Task UpdateRule_ReturnsBadRequest_WhenModelStateInvalid()
        {
            _controller.ModelState.AddModelError("Name", "Required");

            var dto = new RuleDTO
            {
                Id = 1,
                Name = "Rule 1",
                RuleTarget = RuleTarget.Price.ToString(),
                RuleType = RuleType.Mod.ToString()
            };

            var result = await _controller.UpdateRule(1, dto);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateRule_ReturnsBadRequest_WhenRouteIdDoesNotMatchBodyId()
        {
            var dto = new RuleDTO
            {
                Id = 2,
                Name = "Rule 2",
                RuleTarget = RuleTarget.Price.ToString(),
                RuleType = RuleType.Mod.ToString()
            };

            var result = await _controller.UpdateRule(1, dto);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result.Result as BadRequestObjectResult;
            Assert.That(badRequest!.Value,
                Is.EqualTo("Route id does not match rule id in body."));
        }

        [Test]
        public async Task UpdateRule_ReturnsBadRequest_WhenServiceReturnsNull()
        {
            var dto = new RuleDTO
            {
                Id = 1,
                Name = "Rule 1",
                RuleTarget = RuleTarget.Price.ToString(),
                RuleType = RuleType.Mod.ToString()
            };

            _serviceMock
                .Setup(s => s.UpdateRule(dto))
                .ReturnsAsync((RuleDTO?)null);

            var result = await _controller.UpdateRule(1, dto);

            Assert.That(result.Result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result.Result as BadRequestObjectResult;
            Assert.That(badRequest!.Value,
                Is.EqualTo("Unable to update rule with ID 1."));
        }

        [Test]
        public async Task UpdateRule_ReturnsOk_WhenUpdateSucceeds()
        {
            var dto = new RuleDTO
            {
                Id = 1,
                Name = "UpdatedRule",
                RuleTarget = RuleTarget.Price.ToString(),
                RuleType = RuleType.Mod.ToString()
            };

            _serviceMock
                .Setup(s => s.UpdateRule(dto))
                .ReturnsAsync(dto);

            var result = await _controller.UpdateRule(1, dto);

            Assert.That(result.Result, Is.TypeOf<OkObjectResult>());

            var ok = result.Result as OkObjectResult;
            Assert.That(ok!.Value, Is.EqualTo(dto));
        }

        #endregion
    }
}
