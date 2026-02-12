using System.Text;
using cash_register_backend.Controllers;
using cash_register_backend.DTOs;
using cash_register_backend.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace cash_register_backend.Tests.Controllers
{
    [TestFixture]
    public class CalculateControllerTests
    {
        private Mock<ICalculateService> _serviceMock = null!;
        private Mock<ILogger<CalculateController>> _loggerMock = null!;
        private CalculateController _controller = null!;

        [SetUp]
        public void Setup()
        {
            _serviceMock = new Mock<ICalculateService>();
            _loggerMock = new Mock<ILogger<CalculateController>>();

            _controller = new CalculateController(
                _loggerMock.Object,
                _serviceMock.Object);
        }

        [Test]
        public async Task Calculate_ReturnsBadRequest_WhenDtoIsNull()
        {
            var result = await _controller.Calculate(null!);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest!.Value, Is.EqualTo("File is required."));
        }

        [Test]
        public async Task Calculate_ReturnsBadRequest_WhenFileIsNull()
        {
            var dto = new CalculateDTO
            {
                InputFile = null!
            };

            var result = await _controller.Calculate(dto);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Calculate_ReturnsBadRequest_WhenFileIsEmpty()
        {
            var file = CreateFormFile(""); // empty content

            var dto = new CalculateDTO
            {
                InputFile = file
            };

            var result = await _controller.Calculate(dto);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Calculate_ReturnsBadRequest_WhenServiceReturnsNull()
        {
            var file = CreateFormFile("1.00,2.00");

            var dto = new CalculateDTO
            {
                InputFile = file
            };

            _serviceMock
                .Setup(s => s.CalculateChange(dto))
                .ReturnsAsync((List<string>?)null);

            var result = await _controller.Calculate(dto);

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());

            var badRequest = result as BadRequestObjectResult;
            Assert.That(badRequest!.Value, Is.EqualTo("Invalid File."));
        }

        [Test]
        public async Task Calculate_ReturnsOk_WithCsvContent_WhenServiceReturnsResults()
        {
            var file = CreateFormFile("1.00,2.00");

            var dto = new CalculateDTO
            {
                InputFile = file
            };

            var serviceResults = new List<string>
            {
                "1 Dollar",
                "3 Quarter"
            };

            _serviceMock
                .Setup(s => s.CalculateChange(dto))
                .ReturnsAsync(serviceResults);

            var result = await _controller.Calculate(dto);

            Assert.That(result, Is.TypeOf<OkObjectResult>());

            var okResult = result as OkObjectResult;
            Assert.That(okResult!.Value, Is.Not.Null);

            var responseDto = okResult.Value as CalculateResultDTO;
            Assert.That(responseDto, Is.Not.Null);

            var expectedCsv = new StringBuilder()
                .AppendLine("1 Dollar")
                .AppendLine("3 Quarter")
                .ToString();

            Assert.That(responseDto!.CalculationResults, Is.EqualTo(expectedCsv));
        }

        private static IFormFile CreateFormFile(string content)
        {
            var bytes = Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);

            return new FormFile(stream, 0, bytes.Length, "InputFile", "test.csv");
        }
    }
}

