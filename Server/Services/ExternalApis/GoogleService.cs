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
    public GoogleService(IOptions<AppSettings> appSettings)
    {
        GoogleCredential serviceAccountCredential = null;
        if (string.IsNullOrEmpty(appSettings.Value.GoogleOptions.DEV_ServiceAccountJson))
        {
            serviceAccountCredential = GoogleCredential.FromJson(JsonSerializer.Serialize(appSettings.Value.GoogleOptions.ServiceAccountCredentials))
                .CreateScoped(DriveService.Scope.Drive, DocsService.Scope.Documents);
        }
        else
        {
            serviceAccountCredential = GoogleCredential.FromFile(appSettings.Value.GoogleOptions.DEV_ServiceAccountJson)
                .CreateScoped(DriveService.Scope.Drive, DocsService.Scope.Documents);
        }

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