using Data.Database;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly CliannaDbContext _dbContext;

    public UserController(CliannaDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    [HttpGet(Name = "GetUsers")]
    public IEnumerable<string> Get()
    {
        return _dbContext.Users.Select(x => x.Email);
    }
}

