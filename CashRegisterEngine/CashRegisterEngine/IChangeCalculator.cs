using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace CashRegisterEngine
{
    public interface IChangeCalculator
    {
        string ProcessAndGetOutputFilePath(string inputFilePath);
    }
}
