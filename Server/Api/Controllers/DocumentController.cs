using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Entities;
using Data.Models.Messages;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

[Authorize]
public class DocumentController : EntityBaseController<Document, UpsertDocumentReqeust>
{
    public DocumentController(IResponseFactory responseFactory, IDocumentService service) : base(responseFactory,
        service)
    {
    }
}