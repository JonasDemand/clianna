using Data.Database;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class RunEfMigrationsTask(IServiceProvider serviceProvider) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = serviceProvider.CreateScope();
        await using var dbContext =
            scope.ServiceProvider.GetRequiredService<CliannaDbContext>();
        await dbContext.Database.MigrateAsync(stoppingToken);
    }
}