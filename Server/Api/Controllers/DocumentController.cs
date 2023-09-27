using Api.Attributes;
using Data.Models.Entities;
using Data.Models.Messages;
using Services;

namespace Api.Controllers;

[Authorize]
public class DocumentController : EntityBaseController<Document, UpsertDocument>
{
    public DocumentController(IResponseFactory responseFactory, IDocumentService service) : base(responseFactory,
        service)
    {
    }
}