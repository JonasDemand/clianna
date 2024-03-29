﻿// <auto-generated />
using System;
using Data.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Api.Migrations
{
    [DbContext(typeof(CliannaDbContext))]
    [Migration("20240205221149_RefactorRefreshTokenToExpireDate")]
    partial class RefactorRefreshTokenToExpireDate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Data.Models.Entities.Customer", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("City")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Comment")
                        .HasColumnType("varchar(10000)");

                    b.Property<bool>("Disabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Email")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("FirstName")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("LastName")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Mobile")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Phone")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("PostalCode")
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("Salutation")
                        .HasColumnType("int");

                    b.Property<double?>("ShoeSize")
                        .HasColumnType("double");

                    b.Property<string>("Street")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("StreetNumber")
                        .HasColumnType("varchar(255)");

                    b.Property<bool?>("WhatsApp")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("Id");

                    b.ToTable("Customers", (string)null);
                });

            modelBuilder.Entity("Data.Models.Entities.Document", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime");

                    b.Property<string>("CustomerId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("GoogleId")
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("IncrementalId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("OrderId")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Template")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.HasIndex("OrderId");

                    b.ToTable("Documents", (string)null);
                });

            modelBuilder.Entity("Data.Models.Entities.Order", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Article")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Brand")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Color")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Comment")
                        .HasColumnType("varchar(10000)");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime");

                    b.Property<string>("CustomerId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Dealer")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime?>("DueDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<bool>("Pending")
                        .HasColumnType("tinyint(1)");

                    b.Property<double?>("Price")
                        .HasColumnType("double");

                    b.Property<int?>("ShippingType")
                        .HasColumnType("int");

                    b.Property<double?>("Size")
                        .HasColumnType("double");

                    b.Property<int?>("Taxes")
                        .HasColumnType("int");

                    b.Property<int?>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Orders", (string)null);
                });

            modelBuilder.Entity("Data.Models.Entities.RefreshToken", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("ExpireDate")
                        .HasColumnType("datetime");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("RefreshTokens", (string)null);
                });

            modelBuilder.Entity("Data.Models.Entities.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Enabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("varchar(1000)");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("varchar(1000)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("Data.Models.Entities.Document", b =>
                {
                    b.HasOne("Data.Models.Entities.Customer", "Customer")
                        .WithMany("Documents")
                        .HasForeignKey("CustomerId");

                    b.HasOne("Data.Models.Entities.Order", "Order")
                        .WithMany("Documents")
                        .HasForeignKey("OrderId");

                    b.Navigation("Customer");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("Data.Models.Entities.Order", b =>
                {
                    b.HasOne("Data.Models.Entities.Customer", "Customer")
                        .WithMany("Orders")
                        .HasForeignKey("CustomerId");

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Data.Models.Entities.RefreshToken", b =>
                {
                    b.HasOne("Data.Models.Entities.User", "User")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Data.Models.Entities.Customer", b =>
                {
                    b.Navigation("Documents");

                    b.Navigation("Orders");
                });

            modelBuilder.Entity("Data.Models.Entities.Order", b =>
                {
                    b.Navigation("Documents");
                });

            modelBuilder.Entity("Data.Models.Entities.User", b =>
                {
                    b.Navigation("RefreshTokens");
                });
#pragma warning restore 612, 618
        }
    }
}
