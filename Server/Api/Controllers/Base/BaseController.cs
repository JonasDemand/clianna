using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Services.Api;

namespace Api.Controllers.Base;

[Route("[controller]")]
[ApiController]
public class BaseController(IResponseFactory responseFactory, IMapper mapper) : ControllerBase
{
    protected readonly IMapper _mapper = mapper;
    protected readonly IResponseFactory _responseFactory = responseFactory;
}