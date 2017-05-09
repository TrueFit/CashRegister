using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.Services.Contracts
{
    public interface IChangeDenominationService
    {
        string CalculateStandardChangeDenominations(int changeInCents);
        string CalculateRandomChangeDenominations(int changeInCents);
    }
}
