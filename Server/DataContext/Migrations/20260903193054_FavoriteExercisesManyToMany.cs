using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class FavoriteExercisesManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersList_ExercisesList_ExerciseId",
                table: "UsersList");

            migrationBuilder.DropIndex(
                name: "IX_UsersList_ExerciseId",
                table: "UsersList");

            migrationBuilder.DropColumn(
                name: "ExerciseId",
                table: "UsersList");

            migrationBuilder.CreateTable(
                name: "ExerciseUser",
                columns: table => new
                {
                    FavoriteExercisesId = table.Column<int>(type: "int", nullable: false),
                    FavoriteExercisesId1 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseUser", x => new { x.FavoriteExercisesId, x.FavoriteExercisesId1 });
                    table.ForeignKey(
                        name: "FK_ExerciseUser_ExercisesList_FavoriteExercisesId",
                        column: x => x.FavoriteExercisesId,
                        principalTable: "ExercisesList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExerciseUser_UsersList_FavoriteExercisesId1",
                        column: x => x.FavoriteExercisesId1,
                        principalTable: "UsersList",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseUser_FavoriteExercisesId1",
                table: "ExerciseUser",
                column: "FavoriteExercisesId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExerciseUser");

            migrationBuilder.AddColumn<int>(
                name: "ExerciseId",
                table: "UsersList",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UsersList_ExerciseId",
                table: "UsersList",
                column: "ExerciseId");

            migrationBuilder.AddForeignKey(
                name: "FK_UsersList_ExercisesList_ExerciseId",
                table: "UsersList",
                column: "ExerciseId",
                principalTable: "ExercisesList",
                principalColumn: "Id");
        }
    }
}
