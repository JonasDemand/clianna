using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Entities;
using Data.Models.Messages;
using Microsoft.AspNetCore.Mvc;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

[Authorize]
public class DocumentController : EntityBaseController<Document, UpsertDocumentReqeust>
{
    private readonly IDocumentService _documentService;

    public DocumentController(IResponseFactory responseFactory, IDocumentService documentService) : base(
        responseFactory,
        documentService)
    {
        _documentService = documentService;
    }

    [HttpPost("{id}/copy")]
    public async Task<ActionResult<Response<Document>>> Put(string id, CopyDocumentRequest document)
    {
        return Ok(_responseFactory.Create(await _documentService.Copy(id, document)));
    }
}