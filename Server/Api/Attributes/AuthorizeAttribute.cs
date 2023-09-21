using System.Net;
using System.Text.Json;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Services;

namespace Api.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.HttpContext.Items["User"] is not UserSession)
            {
                var responseFactory = context.HttpContext.RequestServices.GetService<IResponseFactory>()!;

                context.Result = new JsonResult(responseFactory.Create(HttpStatusCode.Unauthorized, "You are not authorized!")) { StatusCode = (int)HttpStatusCode.Unauthorized };
            }
        }
    }
}
