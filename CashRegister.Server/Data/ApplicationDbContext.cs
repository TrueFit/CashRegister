using CashRegister.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CashRegister.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Currency> Currencies { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=database.db");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Call the base implementation

            var usd = new Currency
            {
                CurrencyCode = "USD",
                Name = "US Dollars"
            };

            var eur = new Currency
            {
                CurrencyCode = "EUR",
                Name = "Euros"
            };

            modelBuilder.Entity<Currency>(c =>
            {
                c.HasData(usd);
                c.OwnsMany(d => d.Denominations).HasData(
                    [
                        new() {
                            CurrencyCode = "USD",
                            Name = "Hundred",
                            Plural = "Hundreds",
                            Value = 100
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Twenty",
                            Plural = "Twenties",
                            Value = 20
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Ten",
                            Plural = "Tens",
                            Value = 10
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Five",
                            Plural = "Fives",
                            Value = 5
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "One",
                            Plural = "Ones",
                            Value = 1
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Quarter",
                            Plural = "Quarters",
                            Value = 0.25M
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Dime",
                            Plural = "Dimes",
                            Value = 0.10M
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Nickel",
                            Plural = "Nickels",
                            Value = 0.05M
                        },
                        new() {
                            CurrencyCode = "USD",
                            Name = "Penny",
                            Plural = "Pennies",
                            Value = 0.01M
                        }
                    ]
                );

                c.HasData(eur);
                c.OwnsMany(d => d.Denominations).HasData(
                    [
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Hundred",
                            Plural = "Hundreds",
                            Value = 100
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Fifty",
                            Plural = "Fifties",
                            Value = 50
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Twenty",
                            Plural = "Twenties",
                            Value = 20
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Ten",
                            Plural = "Tens",
                            Value = 10
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Five",
                            Plural = "Fives",
                            Value = 5
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Two",
                            Plural = "Twoes",
                            Value = 1
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "One",
                            Plural = "Ones",
                            Value = 1
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Fifty Cent Coin",
                            Plural = "Fifty Cent Coins",
                            Value = 0.50M
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Ten Cent Coin",
                            Plural = "Ten Cent Coins",
                            Value = 0.10M
                        },
                        new() {
                            CurrencyCode = "EUR",
                            Name = "Five Cent Coin",
                            Plural = "Five Cent Coins",
                            Value = 0.05M
                        }
                    ]
                );
            });
        }
    }
}
