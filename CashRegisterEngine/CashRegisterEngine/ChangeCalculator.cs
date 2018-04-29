using System;
using System.Threading.Tasks;

namespace CashRegisterEngine
{
    public class ChangeCalculator : IChangeCalculator
    {
        int[] paperDenominations = { 100, 50, 20, 10, 5, 1 };
        int[] coinDenominations = { 25, 10, 5, 1 };

        public GetChangeResponse GetChange(GetChangeRequest request)
        {
            GetChangeResponse response = null;

            return response;
        }

        public async Task<GetChangeResponse> GetChangeAsync(GetChangeRequest request)
        {
            return await Task.Run(() => GetChange(request));
        }
    }
}
