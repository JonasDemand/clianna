using System.Net;
using System.Text.Json;
using Data.Models.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Services;

namespace Api.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public async void OnAuthorization(AuthorizationFilterContext context)
        {
            if (context.HttpContext.Items["User"] is not UserSession)
            {
                var responseFactory = context.HttpContext.RequestServices.GetService<IResponseFactory>()!;

                var response = context.HttpContext.Response;
                response.ContentType = "application/json";
                response.StatusCode = (int)HttpStatusCode.Unauthorized;

                var errorJson = JsonSerializer.Serialize(responseFactory.Create(HttpStatusCode.Unauthorized, "You are not authorized!"));

                await response.WriteAsync(errorJson);
            }
        }
    }
}
