namespace Services.Maintenance;

public interface IMigrationService
{
    public Task MigrateLegacyDb(string dbName);
}