using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Models.Entities;

public class CustomerEntityTypeConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(e => e.Id);

        builder
            .Property(e => e.Id)
            .HasColumnType("varchar(255)")
            .IsRequired();
        builder
            .Property(e => e.FirstName)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.LastName)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Email)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Street)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.StreetNumber)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.City)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.PostalCode)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Phone)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Mobile)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.WhatsApp)
            .HasColumnType("tinyint(1)");
        builder
            .Property(e => e.ShoeSize)
            .HasColumnType("double");
        builder
            .Property(e => e.Disabled)
            .HasColumnType("tinyint(1)")
            .IsRequired();
        builder
            .Property(e => e.Comment)
            .HasColumnType("varchar(10000)");
        builder
            .Property(e => e.Salutation)
            .HasColumnType("int");

        //FK
        builder.HasMany(e => e.Orders)
            .WithOne(e => e.Customer);
        builder.HasMany(e => e.Documents)
            .WithOne(e => e.Customer);
        builder.HasMany(e => e.Messages)
            .WithOne(e => e.Customer);

        //Navigation
        builder.Navigation(e => e.Orders);
        builder.Navigation(e => e.Documents);
        builder.Navigation(e => e.Messages);
    }
}