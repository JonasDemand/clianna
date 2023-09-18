using Api.Attributes;
using Data.Database.Repositories;
using Data.Models.Entities;
using Services;

namespace Api.Controllers
{
    [Authorize]
    public class DocumentController : DbBaseController<Document>
    {
        public DocumentController(IResponseFactory responseFactory, IDocumentRepository repository) : base(responseFactory, repository)
        {
        }
    }
}

