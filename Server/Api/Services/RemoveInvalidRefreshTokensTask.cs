using Data.Database.Repositories;

namespace Api.Services;

public class RemoveInvalidRefreshTokensTask(
    ILogger<RemoveInvalidRefreshTokensTask> logger,
    IServiceProvider serviceProvider) : BackgroundService
{
    private readonly TimeSpan _period = TimeSpan.FromDays(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = serviceProvider.CreateScope();
        var refreshTokenRepository = scope.ServiceProvider.GetRequiredService<IRefreshTokenRepository>();

        using var timer = new PeriodicTimer(_period);
        do
        {
            logger.LogInformation("Removing invalid refresh tokens");
            await refreshTokenRepository.DeleteInvalid();
        } while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken));
    }
}