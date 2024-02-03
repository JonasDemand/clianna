﻿using System.Net;
using Api.Attributes;
using Api.Controllers.Base;
using AutoMapper;
using Data.Models.Messages;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

public class UserController(IUserService userService, IResponseFactory responseFactory, IMapper mapper)
    : BaseController(responseFactory, mapper)
{
    [HttpPost("Authenticate")]
    public async Task<ActionResult<Response<TokenResponse>>> Authenticate(AuthenticateRequest request)
    {
        var tokenResponse = await userService.Authenticate(request.Email, request.Password);

        if (tokenResponse == null)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        return Ok(_responseFactory.Create(tokenResponse));
    }

    [Authorize]
    [HttpPost("Refresh")]
    public async Task<ActionResult<Response<TokenResponse>>> Refresh(string refreshToken)
    {
        var oldJwt = HttpContext.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
        if (oldJwt == null)
            return Unauthorized(_responseFactory.Create(HttpStatusCode.Unauthorized, "You are not authorized!"));

        var tokenResponse = await userService.Refresh(oldJwt, refreshToken);

        if (tokenResponse == null)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));

        return Ok(_responseFactory.Create(tokenResponse));
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
    [HttpGet("Profile")]
    public async Task<ActionResult<Response<UserSession>>> Profile()
    {
        if (HttpContext.Items["User"] is not UserSession userSession)
            return BadRequest(_responseFactory.Create(HttpStatusCode.BadRequest));
        var session = _mapper.Map<UserSession>(await userService.GetById(userSession.Id));
        return Ok(_responseFactory.Create(session));
    }
}