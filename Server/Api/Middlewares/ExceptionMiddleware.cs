using System;
using System.Net;
using System.Text.Json;
using Data.Models.Messages;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Models.Misc;
using Services;

namespace Api.Middlewares
{
	public class ExceptionMiddleware
	{
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IResponseFactory responseFactory)
        {
            try
            {
                await _next(context);
            }
            catch
            {
                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var errorJson = JsonSerializer.Serialize(responseFactory.Create(HttpStatusCode.InternalServerError));

                await response.WriteAsync(errorJson);
            }
        }
    }
}

