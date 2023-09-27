using System.Net;

namespace Data.Models.Messages;

public class Error
{
    public HttpStatusCode Statuscode { get; set; }
    public string Message { get; set; }
}