using Coravel.Scheduling.Schedule.Interfaces;

namespace Shared.Extensions;

public static class ScheduleIntervalExtensions
{
    //RunOnceAtStart is only available on IScheduleConfiguration. This makes it also available on IScheduleInterval
    public static IScheduledEventConfiguration RunOnceAtStart(this IScheduleInterval interval)
    {
        //Cron to run at 31st February (will not run)
        return interval.Cron("0 0 31 2 0").RunOnceAtStart();
    }
}