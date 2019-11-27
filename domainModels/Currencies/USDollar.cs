using System.Collections.Generic;
using Interfaces;
using DomainModels.Denominations;
namespace DomainModels
{
    public class USDollar : ICurrency
    {
        public string Name => "United States Dollar";
        public string Format => "#,###.##";
        public string Code => "USD";
        public string Symbol => "$";
        public int Multiplier => 100;
        public List<IDenomination> Denominations => new List<IDenomination> { new Penny(), new Nickel(), new Dime(), new Quarter(), new Dollar(), new TenDollar(), new FiftyDollar(), new OneHundredDollar() };

    }
}
