using System;

namespace CashRegister.Core.Denominations
{
    /// <summary>
    /// Represents a generic monetary denomination with a corresponding name and value
    /// </summary>
    public class Denomination
    {
        private string name;
        private double val;

        public Denomination(string n, double v)
        {
            name = n;
            val = v;
        }

        public string Name => name;

        public double Value => val;
    }
}
