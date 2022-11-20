using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CBHPredictorWebAPI.Migrations
{
    /// <inheritdoc />
    public partial class CBHDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeadEntries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    leadID = table.Column<int>(type: "int", nullable: true),
                    leadNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    leadStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    leadDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    organisationID = table.Column<int>(type: "int", nullable: true),
                    countryID = table.Column<int>(type: "int", nullable: true),
                    channel = table.Column<int>(type: "int", nullable: true),
                    fieldOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    specificOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    paramOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    diagnosisOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    matrixOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    quantityOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    orderID = table.Column<int>(type: "int", nullable: true),
                    productID = table.Column<int>(type: "int", nullable: true),
                    quantity = table.Column<float>(type: "real", nullable: true),
                    supplierSampleID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cbhSampleID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    supplierID = table.Column<int>(type: "int", nullable: true),
                    matrix = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    supplierCountryID = table.Column<int>(type: "int", nullable: true),
                    unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    storageTemp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    customerID = table.Column<int>(type: "int", nullable: true)
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
