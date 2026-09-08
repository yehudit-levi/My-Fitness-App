using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataContext.Migrations
{
    /// <inheritdoc />
    public partial class UnifyUserCoach : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExercisesList_CoachesList_CoachId",
                table: "ExercisesList");

            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseUser_ExercisesList_FavoriteExercisesId",
                table: "ExerciseUser");

            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseUser_UsersList_FavoriteExercisesId1",
                table: "ExerciseUser");

            migrationBuilder.DropTable(
                name: "CoachesList");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "CoachRequests");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "CoachRequests");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "CoachRequests");

            migrationBuilder.DropColumn(
                name: "ProfilePicturePath",
                table: "CoachRequests");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "CoachRequests");

            migrationBuilder.AddColumn<string>(
                name: "CertificationPath",
                table: "UsersList",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCoach",
                table: "UsersList",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "CoachRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_ExercisesList_UsersList_CoachId",
                table: "ExercisesList",
                column: "CoachId",
                principalTable: "UsersList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseUser_ExercisesList_FavoriteExercisesId1",
                table: "ExerciseUser",
                column: "FavoriteExercisesId1",
                principalTable: "ExercisesList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseUser_UsersList_FavoriteExercisesId",
                table: "ExerciseUser",
                column: "FavoriteExercisesId",
                principalTable: "UsersList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExercisesList_UsersList_CoachId",
                table: "ExercisesList");

            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseUser_ExercisesList_FavoriteExercisesId1",
                table: "ExerciseUser");

            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseUser_UsersList_FavoriteExercisesId",
                table: "ExerciseUser");

            migrationBuilder.DropColumn(
                name: "CertificationPath",
                table: "UsersList");

            migrationBuilder.DropColumn(
                name: "IsCoach",
                table: "UsersList");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CoachRequests");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "CoachRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "CoachRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "CoachRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfilePicturePath",
                table: "CoachRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "CoachRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CoachesList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CertificationPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfilePicturePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoachesList", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ExercisesList_CoachesList_CoachId",
                table: "ExercisesList",
                column: "CoachId",
                principalTable: "CoachesList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseUser_ExercisesList_FavoriteExercisesId",
                table: "ExerciseUser",
                column: "FavoriteExercisesId",
                principalTable: "ExercisesList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseUser_UsersList_FavoriteExercisesId1",
                table: "ExerciseUser",
                column: "FavoriteExercisesId1",
                principalTable: "UsersList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
