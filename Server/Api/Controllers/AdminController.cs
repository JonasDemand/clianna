using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services.Api;
using Services.Maintenance;

namespace Api.Controllers;

[Authorize]
public class AdminController(IResponseFactory responseFactory, IMigrationService migrationService)
    : BaseController(responseFactory)
{
    [HttpPost("MigrateDb")]
    public async Task<ActionResult<Response>> MigrateDb(string dbName)
    {
        await migrationService.MigrateLegacyDb(dbName);
        return Ok(_responseFactory.Create());
    }
}