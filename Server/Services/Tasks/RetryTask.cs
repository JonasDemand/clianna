using Coravel.Invocable;
using Microsoft.Extensions.Logging;

namespace Services.Tasks;

public abstract class RetryTask(ILogger<RetryTask> logger, int retries, TimeSpan timeout) : IInvocable
{
    protected RetryTask(ILogger<RetryTask> logger) : this(logger, 3, TimeSpan.FromMinutes(15))
    {
    }

    protected RetryTask(ILogger<RetryTask> logger, int retries) : this(logger, retries, TimeSpan.FromMinutes(15))
    {
    }

    protected RetryTask(ILogger<RetryTask> logger, TimeSpan timeout) : this(logger, 3, timeout)
    {
    }

    public async Task Invoke()
    {
        for (var attempt = 1; attempt <= retries; attempt++)
            try
            {
                await InvokeWithRetries();
                return; // If the task is successful, exit the loop
            }
            catch (Exception ex)
            {
                logger.LogError($"Attempt {attempt}/{retries} failed", ex);
                if (attempt < retries)
                {
                    await Task.Delay(timeout);
                }
                else
                {
                    // If all retries failed, log an error and exit
                    logger.LogError($"All {retries} attempts failed. Exiting.", ex);
                    throw;
                }
            }
    }

    protected abstract Task InvokeWithRetries();
}