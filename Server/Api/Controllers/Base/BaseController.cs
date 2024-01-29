using Microsoft.AspNetCore.Mvc;
using Services.Api;

namespace Api.Controllers.Base;

[Route("[controller]")]
[ApiController]
public class BaseController(IResponseFactory responseFactory) : ControllerBase
{
    protected readonly IResponseFactory _responseFactory = responseFactory;
}