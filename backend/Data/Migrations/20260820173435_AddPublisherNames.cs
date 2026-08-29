// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

using Microsoft.EntityFrameworkCore.Migrations;

namespace XSharp.Web.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPublisherNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NormalizedPublisherName",
                schema: "registry",
                table: "AspNetUsers",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublisherName",
                schema: "registry",
                table: "AspNetUsers",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "PublisherNameIndex",
                schema: "registry",
                table: "AspNetUsers",
                column: "NormalizedPublisherName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "PublisherNameIndex",
                schema: "registry",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NormalizedPublisherName",
                schema: "registry",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PublisherName",
                schema: "registry",
                table: "AspNetUsers");
        }
    }
}
