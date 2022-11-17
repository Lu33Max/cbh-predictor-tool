using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CBHPredictorWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeadEntries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    leadID = table.Column<int>(type: "int", nullable: false),
                    leadNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    leadStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ladDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    organisationID = table.Column<int>(type: "int", nullable: false),
                    countryID = table.Column<int>(type: "int", nullable: false),
                    channel = table.Column<int>(type: "int", nullable: false),
                    fieldOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    specificOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    paramOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    diagnosisOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    matrixOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    quantityOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadEntries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "OrderEntries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    orderID = table.Column<int>(type: "int", nullable: false),
                    productID = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<float>(type: "real", nullable: false),
                    supplierSampleID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cbhSampleID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    supplierID = table.Column<int>(type: "int", nullable: false),
                    matrix = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    supplierCountryID = table.Column<int>(type: "int", nullable: false),
                    unit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    storageTemp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    customerID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderEntries", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LeadEntries");

            migrationBuilder.DropTable(
                name: "OrderEntries");
        }
    }
}
