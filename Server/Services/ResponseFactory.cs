using System.Net;
using Data.Models.Messages;

namespace Services;

public class ResponseFactory : IResponseFactory
{
    public Response<T> Create<T>(T data)
    {
        return new Response<T>
        {
            Data = data
        };
    }

    public Response Create(Error error)
    {
        return new Response
        {
            Error = error
        };
    }

    public Response Create(HttpStatusCode statusCode)
    {
        return Create(statusCode, "Whoops, something went wrong :/");
    }

    public Response Create(HttpStatusCode statusCode, string message)
    {
        return Create(new Error
        {
            Message = message,
            Statuscode = statusCode
        });
    }
}