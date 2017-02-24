using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.Helpers
{
    /// <summary>
    /// Helper class used to find random numbers, so that Random's constructor is only called once.
    /// </summary>
    public static class RandomHelper
    {
        static Random Rand;

        public static int GetRandomInt(int max)
        {
            if(Rand == null)
            {
                Rand = new Random();
            }
            return Rand.Next(max);
        }
    }
}
