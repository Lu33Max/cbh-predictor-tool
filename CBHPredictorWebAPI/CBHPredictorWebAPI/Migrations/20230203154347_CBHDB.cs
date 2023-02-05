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
                    date = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    date = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    quantityOfInterest = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    lastEdited = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                    collectionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    lastEdited = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderEntries", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "UserModels",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserModels", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "UserModels",
                columns: new[] { "id", "Email", "Password", "RefreshToken", "RefreshTokenExpiryTime", "UserName" },
                values: new object[] { new Guid("e1d752bb-6799-41d3-9a35-af56299b5a99"), "email", "Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSWFJteFZVMjA1VjAxV2JETlhhMk0xVmpGYWMySkVUbGhoTWsweFZqQmFTMk15U2tWVWJHaG9UV3N3ZUZadGNFZFRNazE1VTJ0V1ZXSkhhRzlVVmxaM1ZsWmFkR05GWkZSTmF6RTFWVEowVjFaWFNraGhSemxWVmpOT00xcFZXbUZrUjA1R1drWndWMDFFUlRGV1ZFb3dWakZhV0ZOcmFHaFNlbXhXVm0xNFlVMHhXbk5YYlVacVZtdGFNRlZ0ZUZOVWJVcEdZMFZ3VjJKVVJYZFdha1pYWkVaT2MxZHNhR2xTTW1oWlYxZDRiMkl5Vm5OVmJGWlRZbFZhY2xWcVFURlNNWEJHVjJ4T1ZXSkdjRmxhU0hCSFZqRmFSbUl6WkZkaGExcG9WakJhVDJOdFNrZFRiV3hUVFcxb1dsWXhaRFJpTWtsM1RVaG9XR0pIVWxsWmJHaFRWMFpTVjFkdVpFNVNiRm93V2xWYVQxWlhTbFpYVkVwV1lrWktSRlpxU2tkamJVVjZZVVphYUdFeGNHOVdha0poVkRKT2RGSnJaRmhpVjJoeldXeG9iMkl4V25STldHUlZUV3RzTlZWdGRHdGhiRXAwVld4c1dtSkhhRlJXTUZwVFZqSkdSbFJzVG1sU2JrSmFWMnhXYjJFeFdYZE5WVlpUWWtkU1lWUlZXbUZOTVZweFUydDBWMVpyY0ZwWGExcDNZa2RGZWxGcmJGaFhTRUpJVmtSS1UxWXhXblZVYkdocFZqSm9lbGRYZUc5aU1rbDRWMWhvWVZKR1NuQlVWM1J6VGtaYVdHUkhkR2hXYXpWSFZqSjRVMWR0U2tkWGJXaGFUVlp3VkZacVJtdGtWbkJHVGxaT2FWSnRPVE5XTW5oWFlUQXhSMWRzYUZSaE1sSnhWV3RXWVZZeFduRlViVGxyWWtad2VGVnRkREJoYXpGeVRsVm9XbFpXY0hKWlZXUkdaV3hHY21KR1pGZFNWWEJ2VmpGYWExVXhXWGhVYmxaVllrWktjRlZxUmt0V1ZscEhWV3RLYTAxRVJsTlZSbEYzVUZFOVBRPT0=", null, null, "Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSV01WbDNXa1JTV0ZKdGVGWlZNakExVmpBeFYySkVUbGhoTWsweFZtcEdZV015U2tWVWJHaG9UVlZ3VlZadGNFZFRNbEpJVm10V1VtSlZXbGhXYlhoelRURmFkR05GU214U2JHdzFWVEowVjFaWFNraGhSemxWVm14YU0xWnNXbUZqVmtaMFVteFNUbUpGY0VwV2JURXdZVEZrU0ZOclpHcFNWR3hoV1d4U1IyUnNXbGRYYlVaclVqQTFSMWRyV25kV01ERkZVbFJHVjFaRmIzZFdha1poVjBaT2NtRkhhRk5sYlhoWFZtMHhORmxWTUhoWGJrNVlZbFZhY2xWcVFURlNNVlY1VFZSU1ZrMXJjRmhWTW5SM1ZqSktWVkpZWkZwV1JWcHlWVEJhVDJOc2NFaGpSazVYVWpOb2IxWXhaRFJWTVVsNVZXNU9XR0pIVWxsWmJHaFRWMFpTVjJGRlRsTmlSbkJaV2xWb2ExWXdNVVZTYTFwV1lrWktSRlpxUVhoa1ZsWjFWMnhhYUdFeGNGbFhhMVpoVkRKTmVGcElUbWhTTW5oVVdWUk9RMWRzV1hoWGJYUk9VakZHTlZaWE5VOWhiRXAwVld4c1dtSkdXbWhaTW5oWFl6RldjbHBHVW1sU00yaFlWbXBLTkZReFdsaFRhMlJxVW0xNGFGVXdhRU5UUmxweFUydGFiRlpzV2xwWGExcDNZa2RGZWxGcmJGZGlXRUpJVmtSS1UxWXhXblZVYkdocFZqTm9WVlpHWTNoaU1XUkhWMjVTVGxaRlNsaFVWbVEwVjBaYVdHUkhkRmhTTUZZMVZsZDRjMWR0U2tkWGJXaGFUVlp3VkZacVJtdGtWbkJHVGxaT2FWSnRPVE5XTW5oWFlUQXhSMWRzYUZSaE1sSnhWV3RXWVZZeFduRlViVGxyWWtad2VGVnRkREJoYXpGeVRsVm9XbFpXY0hKWlZXUkdaV3hHY21KR1pGZFNWWEJ2VmpGYWExVXhXWGhVYmxaVllrWktjRlZxUmt0V1ZscEhWV3RLYTAxRVJsTlZSbEYzVUZFOVBRPT0=" });
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

            migrationBuilder.DropTable(
                name: "UserModels");
        }
    }
}
