using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cash_register_backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatingSettingToHaveCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Settings");

            migrationBuilder.AddColumn<int>(
                name: "CurrencyId",
                table: "Settings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Settings_CurrencyId",
                table: "Settings",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Settings_Currencies_CurrencyId",
                table: "Settings",
                column: "CurrencyId",
                principalTable: "Currencies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Settings_Currencies_CurrencyId",
                table: "Settings");

            migrationBuilder.DropIndex(
                name: "IX_Settings_CurrencyId",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "CurrencyId",
                table: "Settings");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
