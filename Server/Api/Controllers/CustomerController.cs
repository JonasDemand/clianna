using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Entities;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

[Authorize]
public class CustomerController : EntityBaseController<Customer, UpsertCustomerRequest>
{
    public CustomerController(IResponseFactory responseFactory, ICustomerService customerService,
        IOptions<JsonOptions> jsonOptions) : base(responseFactory, customerService, jsonOptions)
    {
    }
}