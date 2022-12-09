using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Carrefour.CashFlow.Data.Migrations
{
    /// <inheritdoc />
    public partial class UniqueKeyConsolidated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Consolidated_Date",
                table: "Consolidated",
                column: "Date",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Consolidated_Date",
                table: "Consolidated");
        }
    }
}
