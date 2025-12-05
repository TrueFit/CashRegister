using Microsoft.AspNetCore.Mvc;

namespace CashRegister.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TillTransactionController : ControllerBase
    {
        private IEnumerable<Change> calcChange(decimal due, decimal paid, string currency)
        {
            var retVal = new List<Change>();

            retVal.Add(new Change { Count = 1, Denomination = "quarter" });

            return retVal;
        }

        [HttpPost(Name = "PostSingleTransaction")]
        public IEnumerable<Change> Post([FromBody] Transaction transaction)
        {
            return calcChange(transaction.Due, transaction.Paid, transaction.Currency);
        }
    }
}
