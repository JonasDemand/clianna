using System.Net;
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
    public async Task<ActionResult<Response<ApplyMessageTemplateResponse>>> Put(string id, string reference)
    {
        if (string.IsNullOrEmpty(reference))
            return BadRequest(_responseFactory.Create(new Error
            {
                Statuscode = HttpStatusCode.BadRequest,
                Message = "Reference can't be empty!"
            }));
        return Ok(_responseFactory.Create(await messageService.ApplyTemplate(id, reference)));
    }
}