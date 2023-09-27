using Data.Models.Entities;
using Data.Models.Misc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Data.Database;

public class CliannaDbContext : DbContext
{
    private readonly AppSettings _appSettings;

    public CliannaDbContext(DbContextOptions<CliannaDbContext> options, IOptions<AppSettings> appSettings)
        : base(options)
    {
        _appSettings = appSettings.Value;
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Document> Documents { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySql(_appSettings.DbConnection, ServerVersion.AutoDetect(_appSettings.DbConnection),
            b => b.MigrationsAssembly("Api"));
    }
}