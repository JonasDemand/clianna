using Api.Attributes;
using Api.Controllers.Base;
using AutoMapper;
using Data.Models.Entities;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

[Authorize]
public class MessageController(
    IResponseFactory responseFactory,
    IMapper mapper,
    IMessageService messageService,
    IOptions<JsonOptions> jsonOptions)
    : EntityBaseController<Message, UpsertMessageRequest>(responseFactory, mapper, messageService, jsonOptions)
{
    [HttpGet("{id}/ApplyTemplate")]
    public async Task<ActionResult<Response<Document>>> Put(string id, string? customer, string? order)
    {
        return Ok(_responseFactory.Create(await messageService.ApplyTemplate(id, customer, order)));
    }
}