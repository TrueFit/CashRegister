using CashRegister.Model.Interfaces;
using CashRegister.ViewModels.Implementation;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace CashRegister.UnitTests.ViewModel
{
    [TestClass]
    public class MainViewModelTests
    {
        private const string MOCK_FILE_PATH = "TestFilePath";
        private const string MOCK_FILE_CONTENTS = "3.00,2.73\r\n4.99,3.99";

        [TestMethod]
        public void Should_Set_InputText_After_Reading_File()
        {
            // Setup
            var mock = new Mock<IFileAccess>();
            mock.Setup(fileAccess => fileAccess.ReadFileContents(MOCK_FILE_PATH))
                .Returns(MOCK_FILE_CONTENTS);

            var viewModel = new MainViewModel(mock.Object)
            {
                // InputFilePath is set via binding from the View. Simulate this here.
                InputFilePath = MOCK_FILE_PATH
            };

            // Execute
            viewModel.LoadFileCommand.Execute(null);

            // Check
            Assert.AreEqual(MOCK_FILE_CONTENTS, viewModel.InputFileContentText);
        }

        [TestMethod]
        public void Should_Set_InputFilePath_After_Executing_BrowseCommand()
        {
            // Setup
            var viewModel = new MainViewModel(fileAccess: null);
            viewModel.OnSelectingFile += () => MOCK_FILE_PATH;

            // Execute
            viewModel.BrowseCommand.Execute(null);

            // Check
            Assert.AreEqual(MOCK_FILE_PATH, viewModel.InputFilePath);
        }
    }
}
