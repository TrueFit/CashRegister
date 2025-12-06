using CashRegister.Server.Models;
using CashRegister.Server.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace CashRegister.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TillTransactionController : ControllerBase
    {
        [HttpPost(Name = "PostSingleTransaction")]
        public IEnumerable<Change> Post([FromBody] Transaction transaction)
        {
            var transHelper = new TillTransactionHelper(transaction.Currency);
            return transHelper.CalcChange(transaction.Due, transaction.Paid);
        }
    }
}
