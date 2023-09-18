using Api.Attributes;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services;
using Data.Models.Services;
using System.Net;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : BaseController
{
    private readonly IUserService _userService;

    public UserController(IUserService userService, IResponseFactory responseFactory) : base(responseFactory)
    {
        _userService = userService;
    }


    [HttpPost("Authenticate")]
    public ActionResult<Response<UserSession>> Authenticate(AuthenticateRequest request)
    {
        var session = _userService.Authenticate(request.Username, request.Password);
        
        if (session == null)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        return Ok(_responseFactory.Create(session));
    }

    [Authorize]
    [HttpGet("Update")]
    public IActionResult Update()
    {
        throw new NotImplementedException();
    }
}

