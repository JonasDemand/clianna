using Api.Attributes;
using Api.Controllers.Base;
using Data.Models.Entities;
using Data.Models.Messages;
using Services;
using Services.Api;
using Services.Entities;

namespace Api.Controllers;

[Authorize]
public class DocumentController : EntityBaseController<Document, UpsertDocument>
{
    public DocumentController(IResponseFactory responseFactory, IDocumentService service) : base(responseFactory,
        service)
    {
    }
}