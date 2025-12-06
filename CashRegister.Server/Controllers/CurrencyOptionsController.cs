using CashRegister.Server.Models;
using CashRegister.Server.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace CashRegister.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyOptionsController: ControllerBase
    {
        [HttpGet(Name = "CurrencyOptions")]
        public object Get()
        {
            return CurrencyOptionsUtil.GetCurrencies();
        }
    }
}
