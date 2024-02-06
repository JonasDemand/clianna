using Coravel.Invocable;
using Data.Database;
using Microsoft.EntityFrameworkCore;

namespace Services.Tasks;

public class MigrateDbTask(CliannaDbContext dbContext) : IInvocable
{
    public async Task Invoke()
    {
        await dbContext.Database.MigrateAsync();
    }
}