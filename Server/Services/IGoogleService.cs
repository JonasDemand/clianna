using Google.Apis.Docs.v1;
using Google.Apis.Drive.v3;

namespace Services;

public interface IGoogleService
{
    DocsService Docs { get; }
    DriveService Drive { get; }
}