using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CashRegister.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitCurrencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Currencies",
                columns: table => new
                {
                    CurrencyCode = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currencies", x => x.CurrencyCode);
                });

            migrationBuilder.CreateTable(
                name: "Denomination",
                columns: table => new
                {
                    CurrencyCode = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Plural = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Denomination", x => new { x.CurrencyCode, x.Name });
                    table.ForeignKey(
                        name: "FK_Denomination_Currencies_CurrencyCode",
                        column: x => x.CurrencyCode,
                        principalTable: "Currencies",
                        principalColumn: "CurrencyCode",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Currencies",
                columns: new[] { "CurrencyCode", "Name" },
                values: new object[,]
                {
                    { "EUR", "Euros" },
                    { "USD", "US Dollars" }
                });

            migrationBuilder.InsertData(
                table: "Denomination",
                columns: new[] { "CurrencyCode", "Name", "Plural", "Value" },
                values: new object[,]
                {
                    { "EUR", "Fifty", "Fifties", 50m },
                    { "EUR", "Fifty Cent Coin", "Fifty Cent Coins", 0.50m },
                    { "EUR", "Five", "Fives", 5m },
                    { "EUR", "Five Cent Coin", "Five Cent Coins", 0.05m },
                    { "EUR", "Hundred", "Hundreds", 100m },
                    { "EUR", "One", "Ones", 1m },
                    { "EUR", "Ten", "Tens", 10m },
                    { "EUR", "Ten Cent Coin", "Ten Cent Coins", 0.10m },
                    { "EUR", "Twenty", "Twenties", 20m },
                    { "EUR", "Two", "Twoes", 1m },
                    { "USD", "Dime", "Dimes", 0.10m },
                    { "USD", "Five", "Fives", 5m },
                    { "USD", "Hundred", "Hundreds", 100m },
                    { "USD", "Nickel", "Nickels", 0.05m },
                    { "USD", "One", "Ones", 1m },
                    { "USD", "Penny", "Pennies", 0.01m },
                    { "USD", "Quarter", "Quarters", 0.25m },
                    { "USD", "Ten", "Tens", 10m },
                    { "USD", "Twenty", "Twenties", 20m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Denomination");

            migrationBuilder.DropTable(
                name: "Currencies");
        }
    }
}
