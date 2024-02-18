using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Models.Entities;

public class OrderEntityTypeConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(e => e.Id);
        builder.HasIndex(e => e.CustomerId);

        builder
            .Property(e => e.Id)
            .HasColumnType("varchar(255)")
            .IsRequired();
        builder
            .Property(e => e.CreationDate)
            .HasColumnType("timestamp")
            .IsRequired();
        builder
            .Property(e => e.Pending)
            .HasColumnType("tinyint(1)")
            .IsRequired();
        builder
            .Property(e => e.ShippingType)
            .HasColumnType("int");
        builder
            .Property(e => e.Comment)
            .HasColumnType("varchar(10000)");
        builder
            .Property(e => e.Price)
            .HasColumnType("double");
        builder
            .Property(e => e.Taxes)
            .HasColumnType("int");
        builder
            .Property(e => e.DueDate)
            .HasColumnType("timestamp");
        builder
            .Property(e => e.Type)
            .HasColumnType("int");
        builder
            .Property(e => e.Brand)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Article)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Color)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Dealer)
            .HasColumnType("varchar(255)");
        builder
            .Property(e => e.Size)
            .HasColumnType("double");
        //FK
        builder
            .Property(e => e.CustomerId)
            .HasColumnType("varchar(255)");
        builder.HasOne(e => e.Customer)
            .WithMany(e => e.Orders)
            .HasForeignKey(e => e.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(e => e.Documents)
            .WithOne(e => e.Order);

        //Navigation
        builder.Navigation(e => e.Customer);
        builder.Navigation(e => e.Documents);
    }
}