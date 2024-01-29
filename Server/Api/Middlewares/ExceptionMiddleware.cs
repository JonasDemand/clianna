using System.Net;
using Services.Api;

namespace Api.Middlewares;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task Invoke(HttpContext context, IResponseFactory responseFactory)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, exception.Message);

            var response = context.Response;
            response.ContentType = "application/json";
            response.StatusCode = (int)HttpStatusCode.InternalServerError;

            await response.WriteAsJsonAsync(responseFactory.Create(HttpStatusCode.InternalServerError));
        }
    }
}