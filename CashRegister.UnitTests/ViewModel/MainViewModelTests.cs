using CashRegister.Model.Interfaces;
using CashRegister.ViewModels.Implementation;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegister.UnitTests.ViewModel
{
    [TestClass]
    public class MainViewModelTests
    {
        [TestMethod]
        public void Should_Set_InputText_After_Reading_File()
        {
            const string MOCK_FILE_PATH = "TestFilePath";
            const string RETURN_VALUE = "3.00,2.73\n4.99,3.99";

            // Setup
            var mock = new Mock<IFileAccess>();
            mock.Setup(fileAccess => fileAccess.ReadFileContents(MOCK_FILE_PATH))
                .Returns(RETURN_VALUE);

            var viewModel = new MainViewModel(mock.Object)
            {
                // InputFilePath is set via binding from the View. Simulate this here.
                InputFilePath = MOCK_FILE_PATH
            };


            // Execute
            viewModel.LoadFileCommand.Execute(null);

            // Check
            Assert.AreEqual(RETURN_VALUE, viewModel.InputFileContentText);
        }
    }
}
