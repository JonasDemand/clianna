using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Data.Models.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Models.Misc;
using Services;

namespace Api.Middlewares;

public class JwtMiddleware
{
    private readonly AppSettings _appSettings;
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings)
    {
        _next = next;
        _appSettings = appSettings.Value;
    }

    public async Task Invoke(HttpContext context, IUserService userService)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
            AttachUserToContext(context, userService, token);

        await _next(context);
    }

    private void AttachUserToContext(HttpContext context, IUserService userService, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                ClockSkew = TimeSpan.Zero
            }, out var validatedToken);

            if (validatedToken is not JwtSecurityToken jwtToken) return;
            var userId = jwtToken.Claims.First(x => x.Type == "id").Value;
            var userEmail = jwtToken.Claims.First(x => x.Type == "email").Value;

            // attach user to context on successful jwt validation
            context.Items["User"] = new UserSession
            {
                Id = userId,
                Email = userEmail,
                Token = token
            };
        }
        catch
        {
            // do nothing if jwt validation fails
            // user is not attached to context so request won't have access to secure routes
        }
    }
}