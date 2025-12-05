using Microsoft.AspNetCore.Mvc;

namespace CashRegister.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckController: ControllerBase
    {
        [HttpGet(Name = "HealthCheck")]
        public object Get()
        {
            return new { status = "OK" };
        }
    }
}
