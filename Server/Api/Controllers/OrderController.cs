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
public class OrderController : EntityBaseController<Order, UpsertOrderRequest>
{
    public OrderController(IResponseFactory responseFactory, IOrderService orderService,
        IOptions<JsonOptions> jsonOptions) : base(responseFactory, orderService, jsonOptions)
    {
    }
}