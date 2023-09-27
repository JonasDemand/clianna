using System.Net;
using System.Text.Json;
using Services;
using Services.Api;

namespace Api.Middlewares;

public class ExceptionMiddleware
{
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context, IResponseFactory responseFactory)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, exception.Message);

            var response = context.Response;
            response.ContentType = "application/json";
            response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var errorJson = JsonSerializer.Serialize(responseFactory.Create(HttpStatusCode.InternalServerError));

            await response.WriteAsync(errorJson);
        }
    }
}