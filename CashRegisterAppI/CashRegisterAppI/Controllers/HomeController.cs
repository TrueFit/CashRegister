using CashRegisterAppI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using CashRegisterAppI.Models;
using System.Globalization;

namespace CashRegisterAppI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpPost]
        public IActionResult Index(string txtItem, string txtTotal, string txtCashTender)
        {

            Decimal Totals;
            Decimal MoneyGiven;
            Decimal Change;
            NumberStyles Style;
            Style = NumberStyles.AllowDecimalPoint;
            Totals = Decimal.Parse(txtTotal, Style);
            MoneyGiven = Decimal.Parse(txtCashTender, Style);
            Change = Math.Round(MoneyGiven, 2) - Math.Round(Totals, 2);
            Moneys GetMoneys;
            
            if (int.Parse(txtTotal.Replace(".", "")) % 3 == 0)
            {
                GetMoneys = new Moneys(Change, true);
            }
            else
            {
                GetMoneys = new Moneys(Change);
            }
            
            ViewBag.GetChange = GetMoneys;
            return View("Index");
        }
    }
}
