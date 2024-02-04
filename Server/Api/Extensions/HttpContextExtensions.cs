using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Data.Models.Services;
using Microsoft.IdentityModel.Tokens;

namespace Api.Extensions;

public static class HttpContextExtensions
{
    public static void AttachUserSession(this HttpContext context, string secret, bool validateLifeTime = true)
    {
        try
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(token))
                return;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, //TODO: validate
                ValidateAudience = false,
                ValidateLifetime = validateLifeTime,
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
                Email = userEmail
            };
        }
        catch
        {
            // do nothing if jwt validation fails
            // user is not attached to context so request won't have access to secure routes
        }
    }

    public static UserSession? GetUserSession(this HttpContext context)
    {
        return (UserSession?)context.Items["User"];
    }
}