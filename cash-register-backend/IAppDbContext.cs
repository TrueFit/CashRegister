using cash_register_backend.Models;
using Microsoft.EntityFrameworkCore;


namespace cash_register_backend
{
    public interface IAppDbContext
    {
        DbSet<Currency> Currencies { get; set; }
        DbSet<Denomination> Denominations { get; set; }
        DbSet<Rule> Rules { get; set; }
        DbSet<Setting> Settings { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
