using Coravel;
using Services.Tasks;
using Shared.Extensions;

namespace Api.Extensions;

public static class ServiceProviderTaskExtensions
{
    public static void ScheduleTasks(this IServiceProvider services)
    {
        services.UseScheduler(scheduler =>
        {
            scheduler.Schedule<MigrateDbTask>().RunOnceAtStart();
            scheduler.Schedule<RemoveInvalidRefreshTokensTask>().DailyAtHour(0).RunOnceAtStart();
        });
    }
}