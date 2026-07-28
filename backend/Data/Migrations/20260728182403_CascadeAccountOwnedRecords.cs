// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace XSharp.Web.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class CascadeAccountOwnedRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DELETE FROM registry."AuthChallenges" AS challenge
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM registry."AspNetUsers" AS account
                    WHERE account."Id" = challenge."UserId"
                );

                DELETE FROM registry."RegistryTokens" AS token
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM registry."AspNetUsers" AS account
                    WHERE account."Id" = token."UserId"
                );
                """);

            migrationBuilder.AddForeignKey(
                name: "FK_AuthChallenges_AspNetUsers_UserId",
                schema: "registry",
                table: "AuthChallenges",
                column: "UserId",
                principalSchema: "registry",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RegistryTokens_AspNetUsers_UserId",
                schema: "registry",
                table: "RegistryTokens",
                column: "UserId",
                principalSchema: "registry",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthChallenges_AspNetUsers_UserId",
                schema: "registry",
                table: "AuthChallenges");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistryTokens_AspNetUsers_UserId",
                schema: "registry",
                table: "RegistryTokens");
        }
    }
}
