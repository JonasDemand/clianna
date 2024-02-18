using System.Net;
using Coravel.Invocable;
using Google;
using Microsoft.Extensions.Logging;
using Services.ExternalApis;

namespace Services.Tasks;

public class DeleteGoogleFileTask(ILogger<DeleteGoogleFileTask> logger, IGoogleService googleService)
    : RetryTask(logger), IInvocableWithPayload<string>
{
    public string Payload { get; set; }

    protected override async Task InvokeWithRetries()
    {
        logger.LogInformation("Deleting file with id {id}", Payload);
        try
        {
            await googleService.Drive.Files.Delete(Payload).ExecuteAsync();
        }
        catch (GoogleApiException exception)
        {
            if (exception.HttpStatusCode != HttpStatusCode.NotFound) throw;
            logger.LogInformation("File with id {id} not found while deleting", Payload);
        }
    }
}