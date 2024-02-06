using Coravel;
using Services.Tasks;

namespace Api.Extensions;

public static class ServiceProviderTaskExtionsions
{
    public static void ScheduleTasks(this IServiceProvider services)
    {
        services.UseScheduler(scheduler =>
        {
            scheduler.Schedule<MigrateDbTask>().EveryMinute().Once().RunOnceAtStart();
            scheduler.Schedule<RemoveInvalidRefreshTokensTask>().DailyAtHour(0).RunOnceAtStart();
        });
    }
}