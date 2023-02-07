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
    [Migration("20230203154347_CBHDB")]
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

            modelBuilder.Entity("CBHPredictorWebAPI.Models.UserModel", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("RefreshTokenExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.ToTable("UserModels");

                    b.HasData(
                        new
                        {
                            id = new Guid("e1d752bb-6799-41d3-9a35-af56299b5a99"),
                            Email = "email",
                            Password = "Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSWFJteFZVMjA1VjAxV2JETlhhMk0xVmpGYWMySkVUbGhoTWsweFZqQmFTMk15U2tWVWJHaG9UV3N3ZUZadGNFZFRNazE1VTJ0V1ZXSkhhRzlVVmxaM1ZsWmFkR05GWkZSTmF6RTFWVEowVjFaWFNraGhSemxWVmpOT00xcFZXbUZrUjA1R1drWndWMDFFUlRGV1ZFb3dWakZhV0ZOcmFHaFNlbXhXVm0xNFlVMHhXbk5YYlVacVZtdGFNRlZ0ZUZOVWJVcEdZMFZ3VjJKVVJYZFdha1pYWkVaT2MxZHNhR2xTTW1oWlYxZDRiMkl5Vm5OVmJGWlRZbFZhY2xWcVFURlNNWEJHVjJ4T1ZXSkdjRmxhU0hCSFZqRmFSbUl6WkZkaGExcG9WakJhVDJOdFNrZFRiV3hUVFcxb1dsWXhaRFJpTWtsM1RVaG9XR0pIVWxsWmJHaFRWMFpTVjFkdVpFNVNiRm93V2xWYVQxWlhTbFpYVkVwV1lrWktSRlpxU2tkamJVVjZZVVphYUdFeGNHOVdha0poVkRKT2RGSnJaRmhpVjJoeldXeG9iMkl4V25STldHUlZUV3RzTlZWdGRHdGhiRXAwVld4c1dtSkhhRlJXTUZwVFZqSkdSbFJzVG1sU2JrSmFWMnhXYjJFeFdYZE5WVlpUWWtkU1lWUlZXbUZOTVZweFUydDBWMVpyY0ZwWGExcDNZa2RGZWxGcmJGaFhTRUpJVmtSS1UxWXhXblZVYkdocFZqSm9lbGRYZUc5aU1rbDRWMWhvWVZKR1NuQlVWM1J6VGtaYVdHUkhkR2hXYXpWSFZqSjRVMWR0U2tkWGJXaGFUVlp3VkZacVJtdGtWbkJHVGxaT2FWSnRPVE5XTW5oWFlUQXhSMWRzYUZSaE1sSnhWV3RXWVZZeFduRlViVGxyWWtad2VGVnRkREJoYXpGeVRsVm9XbFpXY0hKWlZXUkdaV3hHY21KR1pGZFNWWEJ2VmpGYWExVXhXWGhVYmxaVllrWktjRlZxUmt0V1ZscEhWV3RLYTAxRVJsTlZSbEYzVUZFOVBRPT0=",
                            UserName = "Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSV01WbDNXa1JTV0ZKdGVGWlZNakExVmpBeFYySkVUbGhoTWsweFZtcEdZV015U2tWVWJHaG9UVlZ3VlZadGNFZFRNbEpJVm10V1VtSlZXbGhXYlhoelRURmFkR05GU214U2JHdzFWVEowVjFaWFNraGhSemxWVm14YU0xWnNXbUZqVmtaMFVteFNUbUpGY0VwV2JURXdZVEZrU0ZOclpHcFNWR3hoV1d4U1IyUnNXbGRYYlVaclVqQTFSMWRyV25kV01ERkZVbFJHVjFaRmIzZFdha1poVjBaT2NtRkhhRk5sYlhoWFZtMHhORmxWTUhoWGJrNVlZbFZhY2xWcVFURlNNVlY1VFZSU1ZrMXJjRmhWTW5SM1ZqSktWVkpZWkZwV1JWcHlWVEJhVDJOc2NFaGpSazVYVWpOb2IxWXhaRFJWTVVsNVZXNU9XR0pIVWxsWmJHaFRWMFpTVjJGRlRsTmlSbkJaV2xWb2ExWXdNVVZTYTFwV1lrWktSRlpxUVhoa1ZsWjFWMnhhYUdFeGNGbFhhMVpoVkRKTmVGcElUbWhTTW5oVVdWUk9RMWRzV1hoWGJYUk9VakZHTlZaWE5VOWhiRXAwVld4c1dtSkdXbWhaTW5oWFl6RldjbHBHVW1sU00yaFlWbXBLTkZReFdsaFRhMlJxVW0xNGFGVXdhRU5UUmxweFUydGFiRlpzV2xwWGExcDNZa2RGZWxGcmJGZGlXRUpJVmtSS1UxWXhXblZVYkdocFZqTm9WVlpHWTNoaU1XUkhWMjVTVGxaRlNsaFVWbVEwVjBaYVdHUkhkRmhTTUZZMVZsZDRjMWR0U2tkWGJXaGFUVlp3VkZacVJtdGtWbkJHVGxaT2FWSnRPVE5XTW5oWFlUQXhSMWRzYUZSaE1sSnhWV3RXWVZZeFduRlViVGxyWWtad2VGVnRkREJoYXpGeVRsVm9XbFpXY0hKWlZXUkdaV3hHY21KR1pGZFNWWEJ2VmpGYWExVXhXWGhVYmxaVllrWktjRlZxUmt0V1ZscEhWV3RLYTAxRVJsTlZSbEYzVUZFOVBRPT0="
                        });
                });
#pragma warning restore 612, 618
        }
    }
}