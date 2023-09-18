using Api.Authentication;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services;
using Data.Models.Services;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }


    [HttpPost("Authenticate")]
    public ActionResult<UserSession> Authenticate(AuthenticateRequest request)
    {
        var session = _userService.Authenticate(request.Username, request.Password);
        
        if (session == null)
            return BadRequest();

        return Ok(session);
    }

    [Authorize]
    [HttpGet("Update")]
    public IActionResult Update()
    {
        throw new NotImplementedException();
    }
}

