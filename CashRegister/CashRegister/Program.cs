using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    class Program
    {
        static void Main(string[] args)
        {
            Currencies curr = new Currencies();

            foreach (Currency crn in curr.currencies)
            {
                Console.WriteLine("{0} or {1} and has a value of {2}", crn.name, crn.plural, crn.value);
            }
            Console.ReadLine();
        }
    }
}
