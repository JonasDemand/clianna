using System.Net;
using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Messages;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc;
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
        var session = await _userService.Authenticate(request.Email, request.Password);

        if (session == null)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        return Ok(_responseFactory.Create(session));
    }

    [Authorize]
    [HttpPut("Profile")]
    public async Task<ActionResult<Response>> Profile(UpdateProfileRequest request)
    {
        if (HttpContext.Items["User"] is not UserSession userSession)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        if (!string.IsNullOrEmpty(request.Password))
        {
            var session = await _userService.Authenticate(userSession.Email, request.OldPassword);

            if (session == null)
                return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));
        }

        var updatedUser = await _userService.UpdateProfile(userSession.Id, request);

        userSession.Id = updatedUser.Id;
        userSession.Email = updatedUser.Email;

        return Ok(_responseFactory.Create());
    }

    [Authorize]
    [HttpGet("Session")]
    public async Task<ActionResult<Response<UserSession>>> Session()
    {
        if (HttpContext.Items["User"] is not UserSession userSession)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        return Ok(_responseFactory.Create(await _userService.GetSession(userSession.Id)));
    }
}