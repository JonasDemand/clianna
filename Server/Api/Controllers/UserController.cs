using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }


    [HttpPost("Authenticate")]
    public IActionResult Authenticate(AuthenticateRequest request)
    {
        var session = _userService.Authenticate(request.Username, request.Password);
        
        if (session == null)
            return BadRequest(new { message = "Username or password is incorrect" });

        return Ok(session);
    }
}

