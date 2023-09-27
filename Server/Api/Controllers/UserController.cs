using System.Net;
using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Messages;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

public class UserController : BaseController
{
    private readonly IUserService _userService;

    public UserController(IUserService userService, IResponseFactory responseFactory) : base(responseFactory)
    {
        _userService = userService;
    }


    [HttpPost("Authenticate")]
    public async Task<ActionResult<Response<UserSession>>> Authenticate(AuthenticateRequest request)
    {
        var session = await _userService.Authenticate(request.Username, request.Password);

        if (session == null)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        return Ok(_responseFactory.Create(session));
    }

    [Authorize]
    [HttpPut("Profile")]
    public IActionResult Profile()
    {
        throw new NotImplementedException();
    }
}