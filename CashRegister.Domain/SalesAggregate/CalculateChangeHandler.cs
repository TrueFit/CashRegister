using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CashRegister.Domain.SalesAggregate
{
    public class CalculateChangeHandler : IRequestHandler<CalculateChange>
    {
        public CalculateChangeHandler()
        {
        }

        public async Task Handle(CalculateChange request, CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            // TODO: Do something
        }
    }
}
