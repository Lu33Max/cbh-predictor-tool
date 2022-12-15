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
                name: "BingSearchTerms",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    terms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    impressions = table.Column<int>(type: "int", nullable: true),
                    clicks = table.Column<int>(type: "int", nullable: true),
                    date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BingSearchTerms", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "GoogleSearchTerms",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    terms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    impressions = table.Column<int>(type: "int", nullable: true),
                    clicks = table.Column<int>(type: "int", nullable: true),
                    date = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoogleSearchTerms", x => x.id);
                });

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
                    customerID = table.Column<int>(type: "int", nullable: true),
                    orderID = table.Column<int>(type: "int", nullable: true),
                    orderDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    orderPrice = table.Column<int>(type: "int", nullable: true),
                    storageTemp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    donorID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cbhSampleID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    matrix = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    supplierID = table.Column<int>(type: "int", nullable: true),
                    supplierSampleID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    productID = table.Column<int>(type: "int", nullable: true),
                    countryID = table.Column<int>(type: "int", nullable: true),
                    quantity = table.Column<float>(type: "real", nullable: true),
                    unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    age = table.Column<int>(type: "int", nullable: true),
                    gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ethnicity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    labParameter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    resultNumerical = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    resultUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    resultInterpretation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    testMethod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    testKitManufacturer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    testSystemManufacturer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    diagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    icd = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    histologicalDiagnosis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    organ = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    collectionCountry = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    collectionDate = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "BingSearchTerms");

            migrationBuilder.DropTable(
                name: "GoogleSearchTerms");

            migrationBuilder.DropTable(
                name: "LeadEntries");

            migrationBuilder.DropTable(
                name: "OrderEntries");
        }
    }
}
