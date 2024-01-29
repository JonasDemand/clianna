using System.Net;
using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Messages;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

public class UserController(IUserService userService, IResponseFactory responseFactory)
    : BaseController(responseFactory)
{
    [HttpPost("Authenticate")]
    public async Task<ActionResult<Response<UserSession>>> Authenticate(AuthenticateRequest request)
    {
        var session = await userService.Authenticate(request.Email, request.Password);

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
            var session = await userService.Authenticate(userSession.Email, request.OldPassword);

            if (session == null)
                return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));
        }

        var updatedUser = await userService.UpdateProfile(userSession.Id, request);

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

        return Ok(_responseFactory.Create(await userService.GetSession(userSession.Id)));
    }
}