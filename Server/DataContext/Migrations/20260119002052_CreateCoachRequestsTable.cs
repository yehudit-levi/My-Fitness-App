using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class CreateCoachRequestsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CoachRequestsList",
                table: "CoachRequestsList");

            migrationBuilder.RenameTable(
                name: "CoachRequestsList",
                newName: "CoachRequests");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CoachRequests",
                table: "CoachRequests",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CoachRequests",
                table: "CoachRequests");

            migrationBuilder.RenameTable(
                name: "CoachRequests",
                newName: "CoachRequestsList");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CoachRequestsList",
                table: "CoachRequestsList",
                column: "Id");
        }
    }
}
