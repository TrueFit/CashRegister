using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CashRegisterEngine
{
    public interface IChangeCalculator 
    {
        GetChangeResponse GetChange(GetChangeRequest request);

        Task<GetChangeResponse> GetChangeAsync(GetChangeRequest request);
    }
}
