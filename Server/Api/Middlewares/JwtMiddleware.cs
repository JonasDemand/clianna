using Api.Extensions;
using Data.Models.Misc;
using Microsoft.Extensions.Options;
using Services.Entities;

namespace Api.Middlewares;

public class JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings)
{
    private readonly string _secret = appSettings.Value.Secret;

    public async Task Invoke(HttpContext context, IUserService userService)
    {
        context.AttachUserSession(_secret);
        await next(context);
    }
}