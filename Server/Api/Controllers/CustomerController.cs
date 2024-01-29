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
public class CustomerController(
    IResponseFactory responseFactory,
    ICustomerService customerService,
    IOptions<JsonOptions> jsonOptions)
    : EntityBaseController<Customer, UpsertCustomerRequest>(responseFactory, customerService, jsonOptions);