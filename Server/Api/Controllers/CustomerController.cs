using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Entities;
using Data.Models.Messages;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

[Authorize]
public class CustomerController : EntityBaseController<Customer, UpsertCustomerRequest>
{
    public CustomerController(IResponseFactory responseFactory, ICustomerService service) : base(responseFactory,
        service)
    {
    }
}