using System.Text.Json;
using Data.Models.Misc;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Docs.v1;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Services.ExternalApis;

public class GoogleService : IGoogleService
{
    public GoogleService(IOptions<AppSettings> appSettings, ILogger<GoogleService> logger)
    {
        Stream stream;
        if (string.IsNullOrEmpty(appSettings.Value.GoogleOptions.DEV_ServiceAccountJson))
        {
            stream = new MemoryStream();
            JsonSerializer.Serialize(stream, appSettings.Value.GoogleOptions.ServiceAccountCredentials);
            logger.LogInformation(JsonSerializer.Serialize(appSettings.Value.GoogleOptions.ServiceAccountCredentials)); //TODO: remove
            stream.Position = 0; //Somehow this is needed to read the stream afterwards
        }
        else
        {
            stream = new FileStream(appSettings.Value.GoogleOptions.DEV_ServiceAccountJson, FileMode.Open,
                FileAccess.Read);
        }

        var serviceAccountCredential = GoogleCredential.FromStream(stream)
            .CreateScoped(DriveService.Scope.Drive, DocsService.Scope.Documents)
            .UnderlyingCredential;
        stream.Dispose();

        Docs = new DocsService(new BaseClientService.Initializer
        {
            HttpClientInitializer = serviceAccountCredential
        });
        Drive = new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = serviceAccountCredential
        });
    }

    public DocsService Docs { get; }
    public DriveService Drive { get; }
}