using System;
using System.IO;
using CashRegister;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ninject;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

//using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace UnitTestCashRegister
{
    [TestClass]
    public class TestCashRegister 
    {
        private static ICashRegister SetUp()
        {
            IKernel kernel = new StandardKernel();
            kernel.Load( new CashRegisterBinding());
            return kernel.Get<ICashRegister>();
        }
        
        [Test]
        public void TestFileInput()
        {
            var cr = SetUp();
            string dataLocation = Environment.CurrentDirectory + "\\TestData\\CashFile.txt";
            var changeList = cr.GetChangeList(dataLocation);

            Assert.IsNotNull(changeList);
            cr.PrintChange(changeList);
        }

        [Test]
        public void TestBlankFile()
        {
            var cr = SetUp();
            string dataLocation = Environment.CurrentDirectory + "\\TestData\\BlankFile.txt";
            var changeList = cr.GetChangeList(dataLocation);
            Assert.Null(changeList);
        }

        [Test]
        public void TestBadDataLocation()
        {
            var cr = SetUp();
            Assert.Throws<FileNotFoundException>(GetExcerption);
        }

        static void GetExcerption()
        {
           SetUp().GetChangeList(Environment.CurrentDirectory + "\\TestData\\Nofile.txt");
        }
    }
}
