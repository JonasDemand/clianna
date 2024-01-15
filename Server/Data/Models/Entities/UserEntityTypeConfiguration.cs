using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Models.Entities;

public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(e => e.Id);
        builder.HasIndex(e => e.Email).IsUnique();

        builder
            .Property(e => e.Id)
            .HasColumnType("varchar(255)")
            .IsRequired();
        builder
            .Property(e => e.Email)
            .HasColumnType("varchar(255)")
            .IsRequired();
        builder
            .Property(e => e.Password)
            .HasColumnType("longtext")
            .IsRequired();
        builder
            .Property(e => e.Salt)
            .HasColumnType("longtext")
            .IsRequired();
        builder
            .Property(e => e.Enabled)
            .HasColumnType("tinyint(1)")
            .IsRequired();
    }
}