using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public interface ICashRegister
    {
        IList<string> GetChangeList(string dataLocation);
        void PrintChange(IEnumerable<string> changeList);
    }
}
