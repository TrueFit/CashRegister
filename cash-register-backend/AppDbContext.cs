using cash_register_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace cash_register_backend
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Denomination> Denominations { get; set; }
        public DbSet<Rule> Rules { get; set; }
        public DbSet<Setting> Settings { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
