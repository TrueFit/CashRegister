using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.Services.Contracts
{
    public interface IOutputFileService
    {
        void ProcessOutputFile();
        void WriteLine(string text);
    }
}
