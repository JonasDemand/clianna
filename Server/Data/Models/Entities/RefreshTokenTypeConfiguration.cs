using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Models.Entities;

public class RefreshTokenTypeConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens");
        builder.HasKey(e => e.Id);

        builder
            .Property(e => e.Id)
            .HasColumnType("varchar(255)")
            .IsRequired();
        builder
            .Property(e => e.Token)
            .HasColumnType("varchar(1000)")
            .IsRequired();
        builder
            .Property(e => e.ExpireDate)
            .HasColumnType("timestamp")
            .IsRequired();

        //FK
        builder
            .Property(e => e.UserId)
            .HasColumnType("varchar(255)")
            .IsRequired();
        builder.HasOne(e => e.User)
            .WithMany(e => e.RefreshTokens)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        //Navigation
        builder.Navigation(e => e.User);
    }
}