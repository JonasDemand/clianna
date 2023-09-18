using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Models.Entities
{
	public class DocumentEntityTypeConfiguration : IEntityTypeConfiguration<Document>
    {
        public void Configure(EntityTypeBuilder<Document> builder)
        {
            builder.ToTable("Documents");
            builder.HasKey(e => e.Id);
            builder.HasIndex(e => e.CustomerId);
            builder.HasIndex(e => e.OrderId);

            builder
                .Property(e => e.Id)
                .HasColumnType("varchar(10)")
                .IsRequired();
            builder
                .Property(e => e.CreationDate)
                .HasColumnType("datetime")
                .IsRequired();
            builder
                .Property(e => e.GoogleId)
                .HasColumnType("varchar(44)");
            builder
                .Property(e => e.Name)
                .HasColumnType("varchar(255)");
            builder
                .Property(e => e.Template)
                .HasColumnType("tinyint(1)")
                .IsRequired();
            builder
                .Property(e => e.IncrementalId)
                .HasColumnType("int");
            //FK
            builder
                .Property(e => e.CustomerId)
                .HasColumnType("varchar(10)");
            builder
                .Property(e => e.OrderId)
                .HasColumnType("varchar(10)");
            builder.HasOne(e => e.Customer)
                .WithMany(e => e.Documents)
                .HasForeignKey(e => e.CustomerId);
            builder.HasOne(e => e.Order)
                .WithMany(e => e.Documents)
                .HasForeignKey(e => e.OrderId);

            //Navigation
            builder.Navigation(e => e.Customer);
            builder.Navigation(e => e.Order);
        }
    }
}

