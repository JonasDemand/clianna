﻿using Api.Attributes;
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
public class DocumentController(
    IResponseFactory responseFactory,
    IMapper mapper,
    IDocumentService documentService,
    IOptions<JsonOptions> jsonOptions)
    : EntityBaseController<Document, UpsertDocumentReqeust>(responseFactory, mapper, documentService, jsonOptions)
{
    [HttpPost("{id}/Copy")]
    public async Task<ActionResult<Response<Document>>> Put(string id, CopyDocumentRequest document)
    {
        return Ok(_responseFactory.Create(await documentService.Copy(id, document)));
    }
}