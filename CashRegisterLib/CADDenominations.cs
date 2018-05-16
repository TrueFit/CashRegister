﻿namespace CashRegisterLib
{
    internal class CADDenominations : CurrencySet
    {
        public CADDenominations()
        {
            Add(new CashDenomination("hundred", "hundreds", 100.00M));
            Add(new CashDenomination("fifty", "fifties", 50.00M));
            Add(new CashDenomination("twenty", "twenties", 20.00M));
            Add(new CashDenomination("ten", "tens", 10.00M));
            Add(new CashDenomination("five", "fives", 5.00M));
            Add(new CashDenomination("toonie", "toonies", 2.00M));
            Add(new CashDenomination("loonie", "loonies", 1.00M));
            Add(new CashDenomination("half-dollar", "half-dollars", 0.50M));
            Add(new CashDenomination("quarter", "quarters", 0.25M));
            Add(new CashDenomination("dime", "dimes", 0.10M));
            Add(new CashDenomination("nickel", "nickels", 0.05M));
            Add(new CashDenomination("penny", "pennies", 0.01M));
        }
    }
}