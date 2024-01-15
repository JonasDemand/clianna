using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services.Api;
using Services.Maintenance;

namespace Api.Controllers;

[Authorize]
public class AdminController : BaseController
{
    private readonly IMigrationService _migrationService;

    public AdminController(IResponseFactory responseFactory, IMigrationService migrationService) : base(responseFactory)
    {
        _migrationService = migrationService;
    }

    [HttpPost("MigrateDb")]
    public async Task<ActionResult<Response>> MigrateDb(string dbName)
    {
        await _migrationService.MigrateLegacyDb(dbName);
        return Ok(_responseFactory.Create());
    }
}