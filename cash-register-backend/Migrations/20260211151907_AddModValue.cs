using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cash_register_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddModValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ModValue",
                table: "Rules",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModValue",
                table: "Rules");
        }
    }
}
