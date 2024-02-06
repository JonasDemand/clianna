using Coravel.Invocable;
using Data.Database.Repositories;
using Microsoft.Extensions.Logging;

namespace Services.Tasks;

public class RemoveInvalidRefreshTokensTask(
    IRefreshTokenRepository refreshTokenRepository,
    ILogger<RemoveInvalidRefreshTokensTask> logger) : IInvocable
{
    public async Task Invoke()
    {
        logger.LogInformation("Removing invalid refresh tokens (older than one day)");
        await refreshTokenRepository.DeleteInvalid();
    }
}