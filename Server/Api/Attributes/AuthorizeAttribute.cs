﻿using System.Net;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Services.Api;

namespace Api.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (context.HttpContext.Items["User"] is UserSession || true) return;

        var responseFactory = context.HttpContext.RequestServices.GetService<IResponseFactory>()!;
        context.Result =
            new JsonResult(responseFactory.Create(HttpStatusCode.Unauthorized, "You are not authorized!"))
                { StatusCode = (int)HttpStatusCode.Unauthorized };
    }
}