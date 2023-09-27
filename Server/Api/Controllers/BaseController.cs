using Microsoft.AspNetCore.Mvc;
using Services;

namespace Api.Controllers;

[Route("[controller]")]
[ApiController]
public class BaseController : ControllerBase
{
    protected readonly IResponseFactory _responseFactory;

    public BaseController(IResponseFactory responseFactory)
    {
        _responseFactory = responseFactory;
    }
}