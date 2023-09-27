using System.Net;
using Data.Models.Messages;

namespace Services;

public interface IResponseFactory
{
    public Response<T> Create<T>(T data);
    public Response Create(Error error);
    public Response Create(HttpStatusCode statusCode);
    public Response Create(HttpStatusCode statusCode, string message);
}