﻿// <auto-generated />
using System;
using CBHPredictorWebAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CBHPredictorWebAPI.Migrations
{
    [DbContext(typeof(CBHDBContext))]
    [Migration("20221219203807_CBHDB")]
    partial class CBHDB
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CBHPredictorWebAPI.Models.BingSearchTerm", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int?>("clicks")
                        .HasColumnType("int");

                    b.Property<string>("date")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("impressions")
                        .HasColumnType("int");

                    b.Property<string>("terms")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("BingSearchTerms");
                });

            modelBuilder.Entity("CBHPredictorWebAPI.Models.GoogleSearchTerm", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int?>("clicks")
                        .HasColumnType("int");

                    b.Property<string>("date")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("impressions")
                        .HasColumnType("int");

                    b.Property<string>("terms")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("GoogleSearchTerms");
                });

            modelBuilder.Entity("CBHPredictorWebAPI.Models.LeadEntry", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int?>("channel")
                        .HasColumnType("int");

                    b.Property<int?>("countryID")
                        .HasColumnType("int");

                    b.Property<string>("diagnosisOfInterest")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("fieldOfInterest")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("lastEdited")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("leadDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("leadID")
                        .HasColumnType("int");

                    b.Property<string>("leadNo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("leadStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("matrixOfInterest")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("organisationID")
                        .HasColumnType("int");

                    b.Property<string>("paramOfInterest")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("quantityOfInterest")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("specificOfInterest")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("LeadEntries");
                });

            modelBuilder.Entity("CBHPredictorWebAPI.Models.LoginEntry", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("LoginEntries");
                });

            modelBuilder.Entity("CBHPredictorWebAPI.Models.OrderEntry", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int?>("age")
                        .HasColumnType("int");

                    b.Property<string>("cbhSampleID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("collectionCountry")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("collectionDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("countryID")
                        .HasColumnType("int");

                    b.Property<int?>("customerID")
                        .HasColumnType("int");

                    b.Property<string>("diagnosis")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("donorID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ethnicity")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("gender")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("histologicalDiagnosis")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("icd")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("labParameter")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("lastEdited")
                        .HasColumnType("datetime2");

                    b.Property<string>("matrix")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("orderDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("orderID")
                        .HasColumnType("int");

                    b.Property<int?>("orderPrice")
                        .HasColumnType("int");

                    b.Property<string>("organ")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("productID")
                        .HasColumnType("int");

                    b.Property<float?>("quantity")
                        .HasColumnType("real");

                    b.Property<string>("resultInterpretation")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal?>("resultNumerical")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("resultUnit")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("storageTemp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("supplierID")
                        .HasColumnType("int");

                    b.Property<string>("supplierSampleID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("testKitManufacturer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("testMethod")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("testSystemManufacturer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("unit")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("OrderEntries");
                });
#pragma warning restore 612, 618
        }
    }
}