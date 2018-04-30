using CashRegisterEngine;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace CashRegisterTests
{
    [TestClass]
    public class ChangeCalculatorTests
    {
        [TestMethod]
        public void GetChangeResponseInsufficientAmountTest()
        {
            GetChangeRequest request = new GetChangeRequest();
            request.amtOwed = 33.0M;
            request.amtPaid = 32.0M;

            try
            {
                var response = ChangeCalculator.Instance.GetChangeResponse(request);
                Assert.IsTrue(false);
            }
            catch (Exception ex)
            {
                Assert.IsNotNull(ex);
                Assert.AreEqual(ex.Message, "Insufficient amount paid to cover amount owed.");
            }
        }

        [TestMethod]
        public void GetChangeResponseEasyTest()
        {
            GetChangeRequest request1 = new GetChangeRequest();
            request1.amtOwed = 3.00M;
            request1.amtPaid = 32.0M;

            GetChangeRequest request2 = new GetChangeRequest();
            request2.amtOwed = 3.00M;
            request2.amtPaid = 32.0M;

            GetChangeRequest request3 = new GetChangeRequest();
            request3.amtOwed = 2.12M;
            request3.amtPaid = 3.0M;

            try
            {
                var response1 = ChangeCalculator.Instance.GetChangeResponse(request1);
                var output1 = response1.ToString();
                Assert.IsTrue(response1.amtChange == request1.amtPaid - request1.amtOwed);

                var response2 = ChangeCalculator.Instance.GetChangeResponse(request2);
                var output2 = response2.ToString();
                Assert.IsTrue(response2.amtChange == request2.amtPaid - request2.amtOwed);

                Assert.AreNotEqual(response1.ToString(), response2.ToString());

                var response3 = ChangeCalculator.Instance.GetChangeResponse(request3);
                var output3 = response3.ToString();
                Assert.IsTrue(response3.amtChange == request3.amtPaid - request3.amtOwed);


            }
            catch (Exception ex)
            {
                Assert.IsTrue(false);
            }
        }
    }
}
