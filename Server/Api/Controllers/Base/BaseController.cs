using Microsoft.AspNetCore.Mvc;
using Services.Api;

namespace Api.Controllers.Base;

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