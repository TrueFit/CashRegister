using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.Services.Contracts
{
    public interface IChangeService
    {
        int CalculateChange(decimal totalCost, decimal amountPaid);
        string ConvertChangeToDenominations(int changeInCents, bool useRandom);
    }
}
